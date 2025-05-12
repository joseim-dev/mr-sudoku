// utils/validation.ts

import { Grid } from "@/lib/sudoku";

export const isDuplicateInRowColOrBox = (
  grid: Grid,
  row: number,
  col: number,
  num: number
): boolean => {
  for (let i = 0; i < 9; i++) {
    if (i !== col && grid[row][i] === num) return true;
    if (i !== row && grid[i][col] === num) return true;
  }

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

export const getConflictCells = (
  grid: Grid,
  row: number,
  col: number,
  num: number
): { row: number; col: number }[] => {
  const conflicts: { row: number; col: number }[] = [];

  for (let i = 0; i < 9; i++) {
    if (i !== col && grid[row][i] === num) conflicts.push({ row, col: i });
    if (i !== row && grid[i][col] === num) conflicts.push({ row: i, col });
  }

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

export const checkPuzzleComplete = (
  grid: Grid,
  solutionGrid: Grid
): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] !== solutionGrid[i][j]) return false;
    }
  }
  return true;
};
