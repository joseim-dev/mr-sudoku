import { Grid } from "../../lib/sudoku";

export const applyHint = (
  grid: Grid,
  solutionGrid: Grid,
  row: number,
  col: number
): Grid => {
  const hintNumber = solutionGrid[row][col];
  return grid.map((r, i) =>
    r.map((cell, j) => (i === row && j === col ? hintNumber : cell))
  );
};
