import AsyncStorage from "@react-native-async-storage/async-storage";
import { Grid } from "../../lib/sudoku";

export const saveGameState = async (state: {
  grid: Grid;
  initialGrid: Grid;
  solutionGrid: Grid;
  memoGrid: number[][][];
  mistakeCount: number;
  time: number;
  difficultyLabel: string;
}) => {
  try {
    await AsyncStorage.setItem("sudokuSavedGame", JSON.stringify(state));
  } catch (err) {
    console.warn("Failed to save game:", err);
  }
};

export const loadGameState = async () => {
  const saved = await AsyncStorage.getItem("sudokuSavedGame");
  return saved ? JSON.parse(saved) : null;
};
