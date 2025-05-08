import { Grid } from "../../lib/sudoku";

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
      if ((i !== row || j !== col) && grid[i][j] === num) return true;
    }
  }

  return false;
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
