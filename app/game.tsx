import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useState } from "react";

import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

import RewardModal from "@/components/Modal/RewardModal";
import {
  interstitialAdId,
  interstitialAdId2,
  rewardedAdId,
  rewardedAdId2,
} from "@/constants/adIds";
import { calculateReward } from "@/utils/game/reward";
import { formatTime } from "@/utils/game/time";
import { checkPuzzleComplete } from "@/utils/game/validation";
import {
  useInterstitialAd,
  useRewardedAd,
} from "react-native-google-mobile-ads";
import NumberPad from "../components/NumberPad";
import SudokuBoard from "../components/SudokuBoard";
import { generatePuzzle, Grid, solveSudoku } from "../lib/sudoku";

export default function GameScreen() {
  const posthog = usePostHog();

  const router = useRouter();
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardResult, setRewardResult] = useState<{
    exp: number;
    coins: number;
  } | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [history, setHistory] = useState<Grid[]>([]);

  const { isLoaded, isClosed, load, show, isEarnedReward } =
    useRewardedAd(rewardedAdId);
  const {
    isLoaded: isLoaded2,
    isClosed: isClosed2,
    load: load2,
    show: show2,
    isEarnedReward: isEarnedReward2,
  } = useRewardedAd(rewardedAdId2);
  const {
    load: load3,
    show: show3,
    isLoaded: isLoaded3,
    isClosed: isClosed3,
  } = useInterstitialAd(interstitialAdId);
  const {
    load: load4,
    show: show4,
    isLoaded: isLoaded4,
    isClosed: isClosed4,
  } = useInterstitialAd(interstitialAdId2);

  const [difficultyLabel, setDifficultyLabel] = useState("");
  const [grid, setGrid] = useState<Grid>([]);
  const [solutionGrid, setSolutionGrid] = useState<Grid>([]);
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [mistakeCells, setMistakeCells] = useState<
    { row: number; col: number }[]
  >([]);
  const [hintCount, setHintCount] = useState(1);
  const [memoMode, setMemoMode] = useState(false);
  const [memoGrid, setMemoGrid] = useState<number[][][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill([]))
  );
  const [time, setTime] = useState(0);

  const handleUndo = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const prevGrid = prev[prev.length - 1];
      setGrid(prevGrid);
      return prev.slice(0, -1);
    });
  };

  useEffect(() => {
    if (isClosed2 && isEarnedReward2) {
      setMistakeCount((prev) => (prev > 0 ? prev - 1 : 0));
      load2();
    }
  }, [isClosed2, isEarnedReward2]);

  useEffect(() => {
    load();
    load2();
    load3();
    load4();
  }, [load, load2, load3, load4]);

  useEffect(() => {
    if (isClosed && isEarnedReward) {
      setHintCount((prev) => prev + 1);
      load();
    }
  }, [isClosed, isEarnedReward]);

  useEffect(() => {
    if (isClosed3 && rewardResult) {
      const { exp, coins } = rewardResult;
      rewardUser(exp, coins).then(() => setShowRewardModal(true));
    }
  }, [isClosed3, rewardResult]);

  useEffect(() => {
    if (isClosed4) {
      router.push("/(tabs)");
    }
  }, [isClosed4]);

  useEffect(() => {
    const loadAndGenerate = async () => {
      const saved = await AsyncStorage.getItem("sudokuSavedGame");
      if (saved) {
        const parsed = JSON.parse(saved);
        setGrid(parsed.grid);
        setHintCount(parsed.hintCount ?? 1);
        setInitialGrid(parsed.initialGrid);
        setSolutionGrid(parsed.solutionGrid);
        setMemoGrid(parsed.memoGrid || memoGrid);
        setMistakeCount(parsed.mistakeCount || 0);
        setTime(parsed.time || 0);
        setDifficultyLabel(parsed.difficultyLabel?.toUpperCase() || "EASY");
        return;
      }
      const difficulty =
        (await AsyncStorage.getItem("sudokuDifficulty")) || "easy";
      const label =
        (await AsyncStorage.getItem("sudokuDifficultyLabel")) || "easy";
      setDifficultyLabel(label.toUpperCase());
      const puzzle = generatePuzzle(difficulty as any);
      const solution = JSON.parse(JSON.stringify(puzzle));
      solveSudoku(solution);
      setGrid(puzzle);
      setInitialGrid(puzzle);
      setSolutionGrid(solution);
    };
    loadAndGenerate();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveGameState = async () => {
    const gameState = {
      grid,
      initialGrid,
      solutionGrid,
      memoGrid,
      mistakeCount,
      time,
      difficultyLabel,
      hintCount,
    };
    await AsyncStorage.setItem("sudokuSavedGame", JSON.stringify(gameState));
  };

  const handleNumberSelect = (num: number | null) => {
    if (!selectedCell || grid.length === 0) return;
    const { row, col } = selectedCell;
    if (grid[row][col] !== null && num !== null) return;

    // 메모 모드일 때
    if (memoMode && num !== null) {
      const newMemoGrid = memoGrid.map((r) => r.map((cell) => [...cell]));
      const notes = newMemoGrid[row][col];
      newMemoGrid[row][col] = notes.includes(num)
        ? notes.filter((n) => n !== num)
        : [...notes, num].sort();
      setMemoGrid(newMemoGrid);
      return;
    }

    // 틀린 입력 처리
    const correctNumber = solutionGrid[row][col];
    if (num !== null && num !== correctNumber) {
      Vibration.vibrate(100);
      setMistakeCells([{ row, col }]);
      setMistakeCount((prev) => prev + 1);

      const tempGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? num : cell))
      );
      setGrid(tempGrid);

      setTimeout(() => {
        const cleared = tempGrid.map((r, i) =>
          r.map((cell, j) => (i === row && j === col ? null : cell))
        );
        setGrid(cleared);
        setMistakeCells([]);
      }, 800);

      if (mistakeCount + 1 >= 3) {
        Alert.alert("Game Over", "You made 3 mistakes!", [
          {
            text: "Get one more chance",
            onPress: () =>
              isLoaded2
                ? (show2(), posthog.capture("Watch Ad(mistake) "))
                : Alert.alert("Ad not ready", "Please try again shortly."),
          },
          {
            text: "Exit",
            onPress: () => router.push("/(tabs)"),
            style: "cancel",
          },
        ]);
      }
      return;
    }

    // 정답 입력 처리
    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? num : cell))
    );
    setHistory((prev) => [...prev, grid.map((r) => [...r])]);
    setGrid(newGrid);
  };

  const rewardUser = async (exp: number, coins: number) => {
    const prevExp = parseInt(
      (await AsyncStorage.getItem("userExp")) || "0",
      10
    );
    const prevCoins = parseInt(
      (await AsyncStorage.getItem("userCoins")) || "0",
      10
    );
    await AsyncStorage.setItem("userExp", (prevExp + exp).toString());
    await AsyncStorage.setItem("userCoins", (prevCoins + coins).toString());
  };

  const handleSubmit = async () => {
    if (!grid.length || !checkPuzzleComplete(grid, solutionGrid)) {
      Alert.alert("Please check again", "There are blanks in the puzzle.");
      return;
    }
    setShowConfetti(true);
    await AsyncStorage.removeItem("sudokuSavedGame");

    const { coins, exp } = calculateReward(
      difficultyLabel.toLowerCase(),
      mistakeCount
    );
    setRewardResult({ coins, exp });
    if (isLoaded3) {
      show3();
      posthog.capture("Game Finished(Ad)");
    } else {
      posthog.capture("Game Finished(No Ad)");

      await rewardUser(exp, coins);
      setShowRewardModal(true);
    }

    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleHint = () => {
    if (!selectedCell || grid.length === 0) return;
    if (hintCount <= 0) {
      Alert.alert("No Hints Left", "Watch an ad to get 1 more hint", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Watch Ad",
          onPress: () => {
            if (isLoaded) {
              show();
              posthog.capture("Watch ad(hint)");
            } else {
              Alert.alert("Ad not ready", "Please try again shortly.");
            }
          },
        },
      ]);
      return;
    }

    const { row, col } = selectedCell;
    if (grid[row][col] !== null) {
      Alert.alert("Hint Unavailable", "This cell is already filled.");
      return;
    }
    const hintNumber = solutionGrid[row][col];
    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? hintNumber : cell))
    );
    setGrid(newGrid);
    setHintCount((prev) => prev - 1);
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleAutoComplete = () => {
    setGrid(solutionGrid);
  };

  return (
    <View style={styles.container}>
      <View className="w-full  h-[4%]" />
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          🔥 {difficultyLabel.toString().toUpperCase()}
        </Text>
        <Text style={styles.headerText}>Mistake: {mistakeCount}/3</Text>
        <Text style={styles.headerText}>Time: {formatTime(time)}</Text>
      </View>

      {grid.length > 0 && (
        <>
          <SudokuBoard
            grid={grid}
            selectedCell={selectedCell}
            onCellSelect={handleCellSelect}
            mistakeCells={mistakeCells}
            memoGrid={memoGrid}
            initialGrid={initialGrid}
          />
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleUndo} style={styles.iconButton}>
              <Ionicons name="arrow-undo-outline" size={24} color="#6E6E6E" />
              <Text style={styles.iconLabel}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHint} style={styles.iconButton}>
              <View style={{ position: "relative" }}>
                <Ionicons
                  name="bulb-outline"
                  size={24}
                  color={hintCount > 0 ? "#6E6E6E" : "#aaa"}
                />
                <View
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -10,
                    backgroundColor: "#FF6D00",
                    borderRadius: 20,
                    paddingHorizontal: 0,
                    width: 16,
                    height: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 8, fontWeight: "bold" }}
                  >
                    {hintCount > 0 ? hintCount : "AD"}
                  </Text>
                </View>
              </View>
              <Text style={styles.iconLabel}>Hint</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMemoMode((prev) => !prev)}
              style={styles.iconButton}
            >
              <Ionicons
                name="pencil-outline"
                size={24}
                color={memoMode ? "#007AFF" : "#6E6E6E"}
              />
              <Text style={styles.iconLabel}>Memo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberSelect(null)}
              style={styles.iconButton}
            >
              <Ionicons name="backspace-outline" size={24} color="#6E6E6E" />
              <Text style={styles.iconLabel}>Erase</Text>
            </TouchableOpacity>
          </View>
          <NumberPad onSelectNumber={handleNumberSelect} />
          <View style={styles.fabRow}>
            <TouchableOpacity
              style={styles.fab}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.fabText}>Mustache!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={async () => {
                await saveGameState();
                router.push("/(tabs)");

                // if (isLoaded4) {
                //   show4();
                // } else {
                //   router.push("/(tabs)");
                // }
              }}
            >
              <Ionicons name="exit-outline" size={26} color="#F28B82" />
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            style={styles.debugButton}
            onPress={handleAutoComplete}
          >
            <Text style={styles.debugText}>Auto Complete</Text>
          </TouchableOpacity> */}
        </>
      )}

      {showConfetti && (
        <ConfettiCannon
          count={120}
          origin={{ x: 180, y: -10 }}
          fallSpeed={2500}
          explosionSpeed={300}
          fadeOut
        />
      )}

      <RewardModal
        visible={showRewardModal}
        exp={rewardResult?.exp || 0}
        coins={rewardResult?.coins || 0}
        onClose={() => {
          setShowRewardModal(false);
          setRewardResult(null);
          router.push("/(tabs)");
        }}
      />
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;
const isSmallDevice = screenHeight < 700; // iPhone SE 등

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FDF7E7",
    justifyContent: "flex-start",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  headerText: { fontSize: 16, color: "#444" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: isSmallDevice ? 4 : 20,
    marginBottom: isSmallDevice ? 8 : 40,
    alignItems: "center",
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#6E6E6E",
  },
  fabRow: {
    position: "absolute",
    bottom: isSmallDevice ? 15 : 35,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: isSmallDevice ? 50 : 60,
  },
  fab: {
    width: "82%",
    backgroundColor: "#265D5A",
    height: isSmallDevice ? 40 : 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    color: "#fff",
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "bold",
    fontFamily: "Nunito",
  },
  exitButton: {
    width: isSmallDevice ? 45 : 50,
    height: isSmallDevice ? 45 : 50,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#F28B82",
    backgroundColor: "#FDF7E7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  debugButton: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: "#bbb",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  debugText: {
    color: "#fff",
    fontWeight: "600",
  },
});
