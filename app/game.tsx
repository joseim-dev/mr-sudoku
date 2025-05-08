// GameScreen.tsx
import CustomButton from "@/components/Button/CustomButton";
import CustomCircleButton from "@/components/Button/CustomCirlcleButton";
import { saveGameState } from "@/utils/game/gameState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, Vibration, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import GameToolBar from "../components/GameToolBar";
import NumberPad from "../components/NumberPad";
import SudokuBoard from "../components/SudokuBoard";
import { Grid } from "../lib/sudoku";
import { applyHint } from "../utils/game/hint";
import { calculateReward } from "../utils/game/reward";
import { useGameInit } from "../utils/game/useGameInit";
import { useTimer } from "../utils/game/useTimer";
import {
  checkPuzzleComplete,
  isDuplicateInRowColOrBox,
} from "../utils/game/validation";

export default function GameScreen() {
  const router = useRouter();
  const [grid, setGrid] = useState<Grid>([]);
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [solutionGrid, setSolutionGrid] = useState<Grid>([]);
  const [memoGrid, setMemoGrid] = useState<number[][][]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [hintCount, setHintCount] = useState(1);
  const [memoMode, setMemoMode] = useState(false);
  const [difficultyLabel, setDifficultyLabel] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [time, setTime] = useState(0);

  useGameInit(
    ({
      grid,
      initialGrid,
      solutionGrid,
      memoGrid,
      mistakeCount,
      time,
      difficultyLabel,
    }) => {
      setGrid(grid);
      setInitialGrid(initialGrid);
      setSolutionGrid(solutionGrid);
      setMemoGrid(memoGrid);
      setMistakeCount(mistakeCount);
      setTime(time);
      setDifficultyLabel(difficultyLabel);
    }
  );

  useTimer(() => setTime((t) => t + 1));

  const handleNumberSelect = (num: number | null) => {
    if (!selectedCell || grid.length === 0) return;
    const { row, col } = selectedCell;
    if (grid[row][col] !== null && num !== null) return;

    if (memoMode && num !== null) {
      const updated = [...memoGrid];
      const notes = updated[row][col];
      updated[row][col] = notes.includes(num)
        ? notes.filter((n) => n !== num)
        : [...notes, num].sort();
      setMemoGrid(updated);
      return;
    }

    const isInvalid = isDuplicateInRowColOrBox(grid, row, col, num!);
    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? num : cell))
    );

    if (isInvalid && num !== null) {
      Vibration.vibrate(100);
      setMistakeCount((prev) => prev + 1);
      setGrid(newGrid);
      setTimeout(() => {
        setGrid((prev) =>
          prev.map((r, i) =>
            r.map((cell, j) => (i === row && j === col ? null : cell))
          )
        );
      }, 800);
      if (mistakeCount + 1 >= 3) {
        Alert.alert("Game Over", "You made 3 mistakes!", [
          { text: "OK", onPress: () => router.push("/(tabs)") },
        ]);
      }
      return;
    }

    setGrid(newGrid);
  };

  const handleHint = () => {
    if (!selectedCell || grid.length === 0) return;
    if (hintCount <= 0) {
      Alert.alert("You have used all your hint");
      return;
    }

    const { row, col } = selectedCell;
    if (grid[row][col] !== null) {
      Alert.alert("Hint Unavailable", "This cell is already filled.");
      return;
    }

    setGrid(applyHint(grid, solutionGrid, row, col));
    setHintCount((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!checkPuzzleComplete(grid, solutionGrid)) {
      Alert.alert("Please check again", "There are blanks in the puzzle.");
      return;
    }

    setShowConfetti(true);
    await AsyncStorage.removeItem("sudokuSavedGame");

    const { exp, coins } = calculateReward(difficultyLabel, mistakeCount);

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

    Alert.alert("🎉 Mr.Sudoku!", `+${exp} EXP\n+${coins} Mustaches`, [
      { text: "OK", onPress: () => router.push("/(tabs)") },
    ]);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleUndo = () => {
    setGrid(initialGrid);
    setMemoGrid(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill([]))
    );
  };

  const handleExit = async () => {
    await saveGameState({
      grid,
      initialGrid,
      solutionGrid,
      memoGrid,
      mistakeCount,
      time,
      difficultyLabel,
    });
    router.push("/(tabs)");
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <View className="flex-1 bg-[#FDF7E7] p-4">
      <View className="flex-row justify-between mt-12 mb-1">
        <Text className="text-base text-[#444]">🔥 {difficultyLabel}</Text>
        <Text className="text-base text-[#444]">Mistake: {mistakeCount}/3</Text>
        <Text className="text-base text-[#444]">Time: {formatTime(time)}</Text>
      </View>

      {grid.length > 0 && (
        <>
          <SudokuBoard
            grid={grid}
            selectedCell={selectedCell}
            onCellSelect={(row, col) => setSelectedCell({ row, col })}
            mistakeCells={[]}
            memoGrid={memoGrid}
            solutionGrid={solutionGrid}
            initialGrid={initialGrid}
          />

          <GameToolBar
            handleUndo={handleUndo}
            handleHint={handleHint}
            handleErase={() => handleNumberSelect(null)}
            memoMode={memoMode}
            setMemoMode={setMemoMode}
            hintCount={hintCount}
          />
          <NumberPad onSelectNumber={handleNumberSelect} />

          <View className="absolute bottom-7 left-4 right-4 flex-row justify-between items-start h-[60px] ">
            <View className="w-[85%] h-full">
              <CustomButton label="Mustache!" onPress={handleSubmit} />
            </View>
            <CustomCircleButton iconName="exit-outline" onPress={handleExit} />
          </View>
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
