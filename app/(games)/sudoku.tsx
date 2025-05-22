import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useState } from "react";

import * as Haptics from "expo-haptics";
import { Alert, Image, useWindowDimensions, View } from "react-native";

import ConfettiCannon from "react-native-confetti-cannon";

import RewardModal from "@/components/Modal/RewardModal";
import NumberPad from "@/components/NumberPad";
import SudokuButton from "@/components/page/games/sudoku/SudokuButton";
import SudokuToolBar from "@/components/page/games/sudoku/SudokuToolBar";
import SudokuBoard from "@/components/SudokuBoard";
import { sudokuRewardedAdId } from "@/constants/adIds";
import { generatePuzzle, Grid, solveSudoku } from "@/lib/sudoku";
import { calculateReward } from "@/utils/game/reward";
import { formatTime } from "@/utils/game/time";
import { checkPuzzleComplete } from "@/utils/game/validation";
import { Ionicons } from "@expo/vector-icons";
import { useRewardedAd } from "react-native-google-mobile-ads";

export default function GameScreen() {
  const posthog = usePostHog();
  const { height } = useWindowDimensions();

  const isSmallDevice = height < 700;

  const router = useRouter();
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardResult, setRewardResult] = useState<{
    exp: number;
    coins: number;
  } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [history, setHistory] = useState<Grid[]>([]);
  const [isGridFilled, setIsGridFilled] = useState(false);

  const { isLoaded, isClosed, load, show, isEarnedReward } =
    useRewardedAd(sudokuRewardedAdId);

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

  const isAllFilled = (grid: Grid): boolean => {
    return grid.every((row) => row.every((cell) => cell !== null));
  };
  useEffect(() => {
    if (isClosed && isEarnedReward) {
      setMistakeCount((prev) => (prev > 0 ? prev - 1 : 0));
      load();
    }
  }, [isClosed, isEarnedReward]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (grid.length > 0) {
      setIsGridFilled(isAllFilled(grid));
    }
  }, [grid]);

  useEffect(() => {
    if (isClosed && isEarnedReward) {
      setHintCount((prev) => prev + 1);
      load();
    }
  }, [isClosed, isEarnedReward]);

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
  const showGameOverAlert = () => {
    Alert.alert("Game Over", "You made 3 mistakes!", [
      {
        text: "Second Chance? (Ad)",
        onPress: () => {
          if (isLoaded) {
            show();
            posthog.capture("Watch Ad(mistake)");
          } else {
            Alert.alert("Ad not ready", "Please try again shortly.", [
              {
                text: "OK",
                onPress: () => {
                  // 광고 준비가 안 되었으면 다시 Game Over Alert을 띄움
                  showGameOverAlert();
                },
              },
            ]);
          }
        },
      },
      {
        text: "Exit",
        onPress: () => router.push("/(tabs)"),
        style: "cancel",
      },
    ]);
  };

  const handleNumberSelect = (num: number | null) => {
    setSelectedNumber(num); // ✅ 숫자 선택 시 상태 저장

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
      Haptics.selectionAsync();
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
        showGameOverAlert(); // ✅ 기존 Alert.alert(...) 대신
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

    posthog.capture("Game Finished(No Ad)");

    await rewardUser(exp, coins);
    setShowRewardModal(true);

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
    <View className="flex-1 bg-[#FDF7E7] justify-start px-[1.5%]">
      <View className="w-full h-[10%] flex-row justify-between items-end ">
        <Ionicons
          name="chevron-back-outline"
          size={28}
          color="#265D5A"
          onPress={() => {
            router.back();
            saveGameState();
          }}
        />
        <Image
          source={require("@/assets/images/mustache.png")}
          style={{ width: 120, height: 30, resizeMode: "contain" }}
        />
        <View className="w-[24px]" />
      </View>
      {grid.length > 0 && (
        <View className="flex-1 justify-between h-[90%] ">
          <View className="w-full h-[5%]" />
          <View className=" h-[85%] w-full  ">
            <View className=" w-full h-fit ">
              <SudokuBoard
                grid={grid}
                selectedCell={selectedCell}
                onCellSelect={handleCellSelect}
                mistakeCells={mistakeCells}
                memoGrid={memoGrid}
                initialGrid={initialGrid}
                difficultyLabel={difficultyLabel}
                mistakeCount={mistakeCount}
                time={time}
                formatTime={formatTime}
                selectedNumber={selectedNumber} // ✅ 새로 추가
              />
            </View>
            <View className="h-[20%] flex justify-center">
              <SudokuToolBar
                hintCount={hintCount}
                memoMode={memoMode}
                handleUndo={handleUndo}
                handleHint={handleHint}
                setMemoMode={setMemoMode}
                handleNumberSelect={handleNumberSelect}
              />
            </View>

            <View className="h-fit flex justify-start">
              <NumberPad onSelectNumber={handleNumberSelect} />
            </View>
          </View>

          <View className="h-[10%]">
            {isSmallDevice ? (
              isGridFilled ? (
                <SudokuButton
                  isSmallDevice={isSmallDevice}
                  handleSubmit={handleSubmit}
                  saveGameState={saveGameState}
                />
              ) : null
            ) : (
              <SudokuButton
                isSmallDevice={isSmallDevice}
                handleSubmit={handleSubmit}
                saveGameState={saveGameState}
              />
            )}
          </View>
        </View>
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
