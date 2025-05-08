// utils/game/useGameInit.ts
import { generatePuzzle, Grid, solveSudoku } from "@/lib/sudoku";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { loadGameState } from "./gameState";

export const useGameInit = (
  setStates: (states: {
    grid: Grid;
    initialGrid: Grid;
    solutionGrid: Grid;
    difficultyLabel: string;
    memoGrid: number[][][];
    mistakeCount: number;
    time: number;
  }) => void
) => {
  useEffect(() => {
    const init = async () => {
      const saved = await loadGameState();
      if (saved) {
        setStates({
          grid: saved.grid,
          initialGrid: saved.initialGrid,
          solutionGrid: saved.solutionGrid,
          memoGrid: saved.memoGrid || [],
          mistakeCount: saved.mistakeCount || 0,
          time: saved.time || 0,
          difficultyLabel: saved.difficultyLabel?.toUpperCase() || "EASY",
        });
        return;
      }

      const difficulty =
        (await AsyncStorage.getItem("sudokuDifficulty")) || "easy";
      const label =
        (await AsyncStorage.getItem("sudokuDifficultyLabel")) || "easy";

      const puzzle = generatePuzzle(difficulty);
      const solution = JSON.parse(JSON.stringify(puzzle));
      solveSudoku(solution);

      setStates({
        grid: puzzle,
        initialGrid: puzzle,
        solutionGrid: solution,
        memoGrid: Array(9)
          .fill(null)
          .map(() => Array(9).fill([])),
        mistakeCount: 0,
        time: 0,
        difficultyLabel: label.toUpperCase(),
      });
    };

    init();
  }, [setStates]);
};
