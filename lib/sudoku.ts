// lib/sudoku.ts

export type Grid = (number | null)[][];

export function isValidMove(
  grid: Grid,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row and column
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[boxRow + r][boxCol + c] === num) return false;
    }
  }

  return true;
}

export function isComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell !== null));
}

// Helper: Deep clone a grid
function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

// Count all possible solutions (used to enforce uniqueness)
function countSolutions(grid: Grid): number {
  let count = 0;

  function backtrack(g: Grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(g, row, col, num)) {
              g[row][col] = num;
              backtrack(g);
              g[row][col] = null;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  backtrack(cloneGrid(grid));
  return count;
}

// Backtracking solver (used for puzzle generation & solving)
function shuffle(array: number[]): number[] {
  return array.sort(() => Math.random() - 0.5);
}

export function solveSudoku(grid: Grid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]); // 무작위 시도
        for (let num of nums) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}
// Generate full solution, then remove cells with uniqueness check
export function generatePuzzle(
  difficulty:
    | "easy"
    | "normal"
    | "medium"
    | "hard"
    | "extreme"
    | "master" = "easy"
): Grid {
  const grid: Grid = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
  solveSudoku(grid); // fill with complete valid solution

  const puzzle = cloneGrid(grid);

  const difficultyMap: Record<string, number> = {
    easy: 30,
    normal: 36,
    medium: 42,
    hard: 48,
    extreme: 54,
    master: 60,
  };
  const removals = difficultyMap[difficulty] ?? 30;

  let removed = 0;
  let attempts = 0;
  const maxAttempts = 1000;

  while (removed < removals && attempts < maxAttempts) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== null) {
      const temp = puzzle[row][col];
      puzzle[row][col] = null;

      if (countSolutions(puzzle) === 1) {
        removed++;
      } else {
        puzzle[row][col] = temp; // 복원
      }
      attempts++;
    }
  }

  return puzzle;
}
