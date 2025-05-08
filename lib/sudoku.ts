// lib/improved-sudoku.ts
// 개선된 스도쿠 라이브러리: 성능 최적화, 안정성 및 모듈화 개선

// 기본 타입 정의
export type Grid = (number | null)[][];
export type Difficulty =
  | "easy"
  | "normal"
  | "medium"
  | "hard"
  | "extreme"
  | "master";

// 난이도별 설정
interface DifficultyConfig {
  cellsToRemove: number;
  minClues: number;
  allowAdvancedPatterns: boolean;
}

const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  easy: { cellsToRemove: 30, minClues: 50, allowAdvancedPatterns: false },
  normal: { cellsToRemove: 36, minClues: 45, allowAdvancedPatterns: false },
  medium: { cellsToRemove: 42, minClues: 40, allowAdvancedPatterns: true },
  hard: { cellsToRemove: 48, minClues: 35, allowAdvancedPatterns: true },
  extreme: { cellsToRemove: 54, minClues: 30, allowAdvancedPatterns: true },
  master: { cellsToRemove: 60, minClues: 25, allowAdvancedPatterns: true },
};

// 유틸리티 함수들
export const SudokuUtils = {
  //그리드의 깊은 복사본을 생성합니다.

  cloneGrid(grid: Grid): Grid {
    return grid.map((row) => [...row]);
  },

  //* 배열의 요소들을 안전하게 섞습니다.

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      // Math.random() 대신 더 나은 방법을 사용할 수 있지만,
      // 브라우저/Node.js 환경에 따라 달라질 수 있어 간단하게 유지합니다.
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  /**
   * 주어진 문자열이 유효한 난이도인지 확인합니다.
   */
  isDifficulty(value: string): value is Difficulty {
    return ["easy", "normal", "medium", "hard", "extreme", "master"].includes(
      value
    );
  },

  /**
   * 그리드가 유효한 형식인지 검증합니다.
   */
  validateGrid(grid: Grid): boolean {
    if (!Array.isArray(grid) || grid.length !== 9) return false;

    for (const row of grid) {
      if (!Array.isArray(row) || row.length !== 9) return false;
      for (const cell of row) {
        if (
          cell !== null &&
          (typeof cell !== "number" ||
            cell < 1 ||
            cell > 9 ||
            !Number.isInteger(cell))
        ) {
          return false;
        }
      }
    }

    return true;
  },
};

// 스도쿠 유효성 검사 관련 함수들
export const SudokuValidator = {
  /**
   * 특정 위치에 숫자를 놓을 수 있는지 확인합니다.
   */
  isValidMove(grid: Grid, row: number, col: number, num: number): boolean {
    // 경계 검사
    if (row < 0 || row >= 9 || col < 0 || col >= 9 || num < 1 || num > 9) {
      throw new Error(
        `유효하지 않은 매개변수: row=${row}, col=${col}, num=${num}`
      );
    }

    // 행 검사
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) return false;
    }

    // 열 검사
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num) return false;
    }

    // 3x3 박스 검사
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[boxRow + r][boxCol + c] === num) return false;
      }
    }

    return true;
  },

  /**
   * 그리드가 완성되었는지 확인합니다.
   */
  isComplete(grid: Grid): boolean {
    return grid.every((row) => row.every((cell) => cell !== null));
  },

  /**
   * 그리드가 스도쿠 규칙에 맞게 채워졌는지 확인합니다.
   */
  isValidGrid(grid: Grid): boolean {
    // 모든 행 확인
    for (let row = 0; row < 9; row++) {
      const seen = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const cell = grid[row][col];
        if (cell !== null) {
          if (seen.has(cell)) return false;
          seen.add(cell);
        }
      }
    }

    // 모든 열 확인
    for (let col = 0; col < 9; col++) {
      const seen = new Set<number>();
      for (let row = 0; row < 9; row++) {
        const cell = grid[row][col];
        if (cell !== null) {
          if (seen.has(cell)) return false;
          seen.add(cell);
        }
      }
    }

    // 모든 3x3 박스 확인
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set<number>();
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const cell = grid[boxRow * 3 + r][boxCol * 3 + c];
            if (cell !== null) {
              if (seen.has(cell)) return false;
              seen.add(cell);
            }
          }
        }
      }
    }

    return true;
  },
};

// 스도쿠 해결 관련 함수들
export const SudokuSolver = {
  /**
   * 백트래킹을 사용하여 스도쿠를 해결합니다.
   */
  solve(grid: Grid): boolean {
    if (!SudokuUtils.validateGrid(grid)) {
      throw new Error("유효하지 않은 그리드 형식입니다.");
    }

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          // 1-9 숫자를 무작위 순서로 시도
          const nums = SudokuUtils.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

          for (const num of nums) {
            if (SudokuValidator.isValidMove(grid, row, col, num)) {
              grid[row][col] = num;

              if (this.solve(grid)) {
                return true;
              }

              grid[row][col] = null; // 백트래킹
            }
          }

          return false; // 해결책 없음
        }
      }
    }

    return true; // 모든 셀이 채워짐
  },

  /**
   * 그리드가 유일한 해결책을 가지는지 확인합니다.
   * 성능을 위해 두 번째 해결책을 찾는 즉시 중단합니다.
   */
  hasUniqueSolution(grid: Grid): boolean {
    let solutions = 0;
    const gridCopy = SudokuUtils.cloneGrid(grid);

    function backtrack(g: Grid): boolean {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (g[row][col] === null) {
            for (let num = 1; num <= 9; num++) {
              if (SudokuValidator.isValidMove(g, row, col, num)) {
                g[row][col] = num;
                if (backtrack(g)) return true; // 두 번째 솔루션을 찾으면 중단
                g[row][col] = null;
              }
            }
            return false;
          }
        }
      }

      solutions++;
      return solutions > 1; // 두 번째 솔루션 발견 시 true
    }

    backtrack(gridCopy);
    return solutions === 1; // 정확히 하나의 솔루션만 있는지
  },
};

// 스도쿠 생성 관련 함수들
export const SudokuGenerator = {
  /**
   * 빈 그리드를 생성합니다.
   */
  createEmptyGrid(): Grid {
    return Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
  },

  /**
   * 완전히 채워진 유효한 스도쿠 그리드를 생성합니다.
   */
  createCompleteGrid(): Grid {
    const grid = this.createEmptyGrid();
    SudokuSolver.solve(grid);
    return grid;
  },

  /**
   * 주어진 난이도로 스도쿠 퍼즐을 생성합니다.
   */
  generatePuzzle(difficultyInput: string = "easy"): Grid {
    // 난이도 검증 및 설정
    let difficulty: Difficulty = "easy";
    if (SudokuUtils.isDifficulty(difficultyInput)) {
      difficulty = difficultyInput;
    } else {
      console.warn(
        `유효하지 않은 난이도 "${difficultyInput}". "easy"로 기본 설정합니다.`
      );
    }

    const config = difficultyConfigs[difficulty];

    // 완전한 솔루션으로 시작
    const solution = this.createCompleteGrid();
    const puzzle = SudokuUtils.cloneGrid(solution);

    // 셀 제거를 위한 준비
    const totalCells = 81;
    const removals = config.cellsToRemove;
    const minRemaining = totalCells - removals;

    // 모든 셀 위치를 담은 배열 생성 및 섞기
    const positions: [number, number][] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push([row, col]);
      }
    }
    const shuffledPositions = SudokuUtils.shuffle(positions);

    // 셀 제거 과정
    let removed = 0;
    let posIndex = 0;

    while (removed < removals && posIndex < shuffledPositions.length) {
      const [row, col] = shuffledPositions[posIndex++];

      if (puzzle[row][col] !== null) {
        const temp = puzzle[row][col];
        puzzle[row][col] = null;

        // 유일한 해결책을 가지는지 확인
        if (SudokuSolver.hasUniqueSolution(puzzle)) {
          removed++;
        } else {
          // 유일한 해결책이 아니면 복원
          puzzle[row][col] = temp;
        }
      }
    }

    return puzzle;
  },

  /**
   * 대칭적인 스도쿠 퍼즐을 생성합니다.
   */
  generateSymmetricPuzzle(difficultyInput: string = "easy"): Grid {
    // 난이도 검증 및 설정
    let difficulty: Difficulty = "easy";
    if (SudokuUtils.isDifficulty(difficultyInput)) {
      difficulty = difficultyInput;
    } else {
      console.warn(
        `유효하지 않은 난이도 "${difficultyInput}". "easy"로 기본 설정합니다.`
      );
    }

    const config = difficultyConfigs[difficulty];

    // 완전한 솔루션으로 시작
    const solution = this.createCompleteGrid();
    const puzzle = SudokuUtils.cloneGrid(solution);

    // 셀 제거를 위한 준비
    const removals = config.cellsToRemove;
    let removed = 0;
    let attempts = 0;
    const maxAttempts = 2000; // 더 많은 시도 허용

    // 대칭적으로 셀 제거
    while (removed < removals && attempts < maxAttempts) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const symmetricRow = 8 - row;
      const symmetricCol = 8 - col;

      // 중앙 셀은 하나만 제거
      if (row === 4 && col === 4) {
        if (puzzle[row][col] !== null) {
          const temp = puzzle[row][col];
          puzzle[row][col] = null;

          if (SudokuSolver.hasUniqueSolution(puzzle)) {
            removed++;
          } else {
            puzzle[row][col] = temp; // 복원
          }
        }
      }
      // 나머지 셀은 대칭적으로 제거
      else if (
        puzzle[row][col] !== null &&
        puzzle[symmetricRow][symmetricCol] !== null
      ) {
        const temp1 = puzzle[row][col];
        const temp2 = puzzle[symmetricRow][symmetricCol];

        puzzle[row][col] = null;
        puzzle[symmetricRow][symmetricCol] = null;

        if (SudokuSolver.hasUniqueSolution(puzzle)) {
          removed += 2; // 두 개 셀 제거
        } else {
          // 복원
          puzzle[row][col] = temp1;
          puzzle[symmetricRow][symmetricCol] = temp2;
        }
      }

      attempts++;
    }

    return puzzle;
  },
};

// 편의를 위한 주요 함수들 직접 내보내기
export const isValidMove = SudokuValidator.isValidMove.bind(SudokuValidator);
export const isComplete = SudokuValidator.isComplete.bind(SudokuValidator);
export const solveSudoku = SudokuSolver.solve.bind(SudokuSolver);
export const generatePuzzle =
  SudokuGenerator.generatePuzzle.bind(SudokuGenerator);
export const generateSymmetricPuzzle =
  SudokuGenerator.generateSymmetricPuzzle.bind(SudokuGenerator);

// 기존 코드와의 호환성을 위한 빈 그리드 생성 함수
export function createEmptyGrid(): Grid {
  return SudokuGenerator.createEmptyGrid();
}
