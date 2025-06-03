import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import SudokuCell from "./SudokuCell"; // 새로운 셀 컴포넌트

type Grid = (number | null)[][];

type Props = {
  grid: Grid;
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  mistakeCells?: { row: number; col: number }[];
  memoGrid?: number[][][];
  initialGrid?: Grid;
  difficultyLabel: string;
  mistakeCount: number;
  time: number;
  formatTime: (time: number) => string;
  selectedNumber: number | null;
};

function SudokuBoard({
  grid,
  selectedCell,
  onCellSelect,
  mistakeCells = [],
  memoGrid = [],
  initialGrid,
  difficultyLabel,
  mistakeCount,
  time,
  formatTime,
  selectedNumber,
}: Props) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mistakeCells.length > 0) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [mistakeCells]);

  // 선택된 셀의 값을 가져오기
  const selectedCellValue = selectedCell
    ? grid[selectedCell.row][selectedCell.col]
    : null;

  return (
    <View className="w-full h-fit flex justify-center ">
      <View className="flex-row justify-between items-end mb-1.5 h-fit">
        <Text className="text-[16px] text-[#444] dark:text-subGray">
          🔥 {difficultyLabel.toString().toUpperCase()}
        </Text>
        <Text className="text-[16px] text-[#444] dark:text-subGray">
          Mistake: {mistakeCount}/3
        </Text>
        <Text className="text-[16px] text-[#444] dark:text-subGray">
          Time: {formatTime(time)}
        </Text>
      </View>
      <Animated.View
        className="w-full aspect-square border-2 border-[#424550] bg-[#FDF6E5] dark:bg-mainBlack dark:border-subGray dark:border-[1px]"
        style={{ transform: [{ translateX: shakeAnim }] }}
      >
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row flex-1">
            {row.map((value, colIndex) => {
              const isSelected =
                selectedCell !== null &&
                selectedCell.row === rowIndex &&
                selectedCell.col === colIndex;

              // 선택된 셀의 값과 같은 숫자인지 확인 (선택된 셀 자체는 제외)
              const isMatchedNumber =
                !isSelected && // 선택된 셀 자체는 제외
                selectedCellValue !== null && // 선택된 셀이 빈 셀이 아닐 때만
                value !== null && // 현재 셀이 빈 셀이 아닐 때만
                value === selectedCellValue; // 값이 같을 때

              const isSameRow =
                selectedCell !== null && selectedCell.row === rowIndex;
              const isSameCol =
                selectedCell !== null && selectedCell.col === colIndex;
              const isSameBox =
                selectedCell !== null &&
                Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3);

              const isHighlighted =
                selectedCell !== null &&
                !isSelected &&
                (isSameRow || isSameCol || isSameBox);

              const isMistake = mistakeCells.some(
                (cell) => cell.row === rowIndex && cell.col === colIndex
              );

              return (
                <SudokuCell
                  key={`${rowIndex}-${colIndex}`}
                  value={value}
                  row={rowIndex}
                  col={colIndex}
                  selected={isSelected}
                  isMistake={isMistake}
                  isHighlighted={isHighlighted}
                  onSelect={onCellSelect}
                  notes={memoGrid?.[rowIndex]?.[colIndex] || []}
                  initialValue={initialGrid?.[rowIndex]?.[colIndex]}
                  isMatchedNumber={isMatchedNumber}
                />
              );
            })}
          </View>
        ))}

        <View className="absolute inset-0">
          {[1, 2].map((i) => (
            <View
              key={`h-${i}`}
              className="absolute left-0 right-0 h-[1.5px] bg-[#424550] dark:bg-subGray dark:h-[1px]"
              style={{ top: `${(i * 100) / 3}%` }}
            />
          ))}
          {[1, 2].map((i) => (
            <View
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-[1.5px] bg-[#424550] dark:bg-subGray dark:w-[1px]"
              style={{ left: `${(i * 100) / 3}%` }}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

export default React.memo(SudokuBoard);
