import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

import {
  TestIds,
  useInterstitialAd,
  useRewardedAd,
} from "react-native-google-mobile-ads";
import NumberPad from "../components/NumberPad";
import SudokuBoard from "../components/SudokuBoard";
import { generatePuzzle, Grid, solveSudoku } from "../lib/sudoku";

export default function GameScreen() {
  const router = useRouter();
  const [pendingReward, setPendingReward] = useState<{
    exp: number;
    coins: number;
  } | null>(null);
  const [shouldNavigateAfterAd, setShouldNavigateAfterAd] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);
  const [history, setHistory] = useState<Grid[]>([]);
  const rewardedAdId = __DEV__
    ? TestIds.REWARDED
    : "ca-app-pub-7270360511167481/7326082369";
  // : Platform.OS === "ios"
  // ? "ca-app-pub-7270360511167481/7326082369"
  // : "ca-app-pub-7270360511167481/6542649584";

  const rewardedAdId2 = __DEV__
    ? TestIds.REWARDED
    : Platform.OS === "ios"
    ? "ca-app-pub-7270360511167481/4776248133"
    : "ca-app-pub-7270360511167481/5390184168";

  const interstitialAdId = __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.OS === "ios"
    ? "ca-app-pub-7270360511167481/3612345866"
    : "ca-app-pub-7270360511167481/4243789307";

  const { isLoaded, isClosed, load, show, isEarnedReward, error } =
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
      // ❗ mistakeCount가 1 이상일 때만 줄이기
      setMistakeCount((prev) => (prev > 0 ? prev - 1 : 0));
      load2(); // 다음 광고를 위해 로드
    }
  }, [isClosed2, isEarnedReward2]);

  useEffect(() => {
    load();
    load2();
    load3();
  }, [load, load2, load3]);

  useEffect(() => {
    if (isClosed && isEarnedReward) {
      setHintCount((prev) => prev + 1); // ✅ 힌트 1개 지급
      load(); // 광고 다시 로드
    }
  }, [isClosed, isEarnedReward]);

  useEffect(() => {
    if (isClosed3) {
      router.push("/(tabs)");
    }
  }, [isClosed3]);

  useEffect(() => {
    const loadAndGenerate = async () => {
      const saved = await AsyncStorage.getItem("sudokuSavedGame");

      if (saved) {
        const parsed = JSON.parse(saved);
        setGrid(parsed.grid);
        setInitialGrid(parsed.initialGrid);
        setSolutionGrid(parsed.solutionGrid);
        setMemoGrid(parsed.memoGrid || memoGrid);
        setMistakeCount(parsed.mistakeCount || 0);
        setTime(parsed.time || 0);
        setDifficultyLabel(parsed.difficultyLabel?.toUpperCase() || "EASY");
        return;
      }

      // 새 게임 생성
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
    };
    try {
      await AsyncStorage.setItem("sudokuSavedGame", JSON.stringify(gameState));
    } catch (err) {
      console.warn("Failed to save game:", err);
    }
  };
  useEffect(() => {
    console.log("Ad loaded?", isLoaded);
    console.log("Ad closed?", isClosed);
    console.log("Reward earned?", isEarnedReward);
    console.log("Error?", error);
  }, [isLoaded, isClosed, isEarnedReward, error]);

  const handleNumberSelect = (num: number | null) => {
    if (!selectedCell || grid.length === 0) return;
    const { row, col } = selectedCell;
    if (grid[row][col] !== null && num !== null) return;

    if (memoMode && num !== null) {
      const newMemoGrid = memoGrid.map((r) => r.map((cell) => [...cell]));
      const notes = newMemoGrid[row][col];
      if (notes.includes(num)) {
        newMemoGrid[row][col] = notes.filter((n) => n !== num);
      } else {
        newMemoGrid[row][col] = [...notes, num].sort();
      }
      setMemoGrid(newMemoGrid);
      return;
    }

    const isDuplicate = isDuplicateInRowColOrBox(grid, row, col, num!);

    if (isDuplicate && num !== null) {
      Vibration.vibrate(100);
      const conflicts = getConflictCells(grid, row, col, num!);
      const fullMistakeSet = [...conflicts, { row, col }];
      setMistakeCells(fullMistakeSet);
      setMistakeCount((prev) => prev + 1);

      const tempGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? num : cell))
      );
      setGrid(tempGrid);

      setTimeout(() => {
        const clearedGrid = tempGrid.map((r, i) =>
          r.map((cell, j) => (i === row && j === col ? null : cell))
        );
        setGrid(clearedGrid);
        setMistakeCells([]);
      }, 800);

      if (mistakeCount + 1 >= 3) {
        Alert.alert("Game Over", "You made 3 mistakes!", [
          {
            text: "Get one more chance",
            onPress: () => {
              if (isLoaded2) {
                show2();
              } else {
                Alert.alert("Ad not ready", "Please try again later.");
              }
            },
          },
          {
            text: "Exit",
            onPress: () => {
              router.push("/(tabs)");
            },
            style: "cancel",
          },
        ]);
      }

      return;
    }

    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? num : cell))
    );
    setHistory((prev) => [...prev, grid.map((r) => [...r])]);

    setGrid(newGrid);
  };

  const isDuplicateInRowColOrBox = (
    grid: Grid,
    row: number,
    col: number,
    num: number
  ): boolean => {
    // 행/열 중복 확인
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === num) return true;
      if (i !== row && grid[i][col] === num) return true;
    }

    // 3x3 박스 내 중복 확인
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;

    for (let i = boxStartRow; i < boxStartRow + 3; i++) {
      for (let j = boxStartCol; j < boxStartCol + 3; j++) {
        if ((i !== row || j !== col) && grid[i][j] === num) {
          return true;
        }
      }
    }

    return false;
  };

  const checkPuzzleComplete = (grid: Grid): boolean => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== solutionGrid[i][j]) return false;
      }
    }
    return true;
  };
  const handleSubmit = async () => {
    if (checkPuzzleComplete(grid)) {
      setShowConfetti(true);
      await AsyncStorage.removeItem("sudokuSavedGame");

      // 🪙 리워드 로직 시작
      // 🎯 고정 경험치 & 보너스 코인 지급 로직
      const coinTable: Record<string, number> = {
        easy: 5,
        normal: 7,
        medium: 10,
        hard: 15,
        extreme: 20,
        master: 25,
      };

      const expTable: Record<string, number> = {
        easy: 10,
        normal: 20,
        medium: 40,
        hard: 60,
        extreme: 80,
        master: 100,
      };

      const baseExp = expTable[difficultyLabel.toLowerCase()] || 10;
      const baseCoins = coinTable[difficultyLabel.toLowerCase()] || 5;

      let multiplier = 1;
      if (mistakeCount === 0) multiplier = 2;
      else if (mistakeCount === 1) multiplier = 1.5;
      else if (mistakeCount === 2) multiplier = 1.2;

      const earnedCoins = Math.floor(baseCoins * multiplier);
      const earnedExp = baseExp; // ❗ 경험치는 고정

      // 기존 값 불러오기
      const prevExp = parseInt(
        (await AsyncStorage.getItem("userExp")) || "0",
        10
      );
      const prevCoins = parseInt(
        (await AsyncStorage.getItem("userCoins")) || "0",
        10
      );

      // 저장
      await AsyncStorage.setItem("userExp", (prevExp + earnedExp).toString());
      await AsyncStorage.setItem(
        "userCoins",
        (prevCoins + earnedCoins).toString()
      );

      // 알림 표시 + 홈으로 이동
      Alert.alert(
        "🎉 Mr.Sudoku!",
        `+${earnedExp} EXP\n+${earnedCoins} Mustaches`,
        [
          {
            text: "OK",
            onPress: () => {
              if (isLoaded3) {
                show3();
              } else {
                router.push("/(tabs)");
              }
            },
          },
        ]
      );

      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      Alert.alert("Please check again", "There are blanks in the puzzle.");
    }
  };

  const handleHint = () => {
    if (!selectedCell || grid.length === 0) return;

    if (hintCount <= 0) {
      Alert.alert("No Hints Left", "Watch an ad to get 1 more hint", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Watch Ad",
          onPress: () => {
            if (isLoaded) {
              show();
              // show3();
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

  const getConflictCells = (
    grid: Grid,
    row: number,
    col: number,
    num: number
  ): { row: number; col: number }[] => {
    const conflicts: { row: number; col: number }[] = [];

    // Row & Column
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === num) conflicts.push({ row, col: i });
      if (i !== row && grid[i][col] === num) conflicts.push({ row: i, col });
    }

    // Box
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;

    for (let i = boxStartRow; i < boxStartRow + 3; i++) {
      for (let j = boxStartCol; j < boxStartCol + 3; j++) {
        if ((i !== row || j !== col) && grid[i][j] === num) {
          conflicts.push({ row: i, col: j });
        }
      }
    }

    return conflicts;
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
            solutionGrid={solutionGrid}
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
              }}
            >
              <Ionicons name="exit-outline" size={26} color="#F28B82" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.debugButton}
            onPress={handleAutoComplete}
          >
            <Text style={styles.debugText}>Auto Complete</Text>
          </TouchableOpacity>
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
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;
const isSmallDevice = screenHeight < 700; // iPhone SE 등

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    marginBottom: isSmallDevice ? 8 : 40, // 추가된 부분
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
    bottom: isSmallDevice ? 10 : 28,
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
