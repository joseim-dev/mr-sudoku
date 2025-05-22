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

  return (
    <View className="w-full h-fit flex justify-center">
      <View className="flex-row justify-between items-end mb-1.5 h-fit">
        <Text className="text-[16px] text-[#444]">
          🔥 {difficultyLabel.toString().toUpperCase()}
        </Text>
        <Text className="text-[16px] text-[#444]">
          Mistake: {mistakeCount}/3
        </Text>
        <Text className="text-[16px] text-[#444]">
          Time: {formatTime(time)}
        </Text>
      </View>
      <Animated.View
        className="w-full aspect-square border-2 border-[#424550] bg-[#FDF6E5]"
        style={{ transform: [{ translateX: shakeAnim }] }}
      >
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row flex-1">
            {row.map((value, colIndex) => {
              const selected =
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex;
              const isMistake = mistakeCells.some(
                (cell) => cell.row === rowIndex && cell.col === colIndex
              );

              return (
                <SudokuCell
                  key={`${rowIndex}-${colIndex}`}
                  value={value}
                  row={rowIndex}
                  col={colIndex}
                  selected={selected}
                  isMistake={isMistake}
                  onSelect={onCellSelect}
                  notes={memoGrid?.[rowIndex]?.[colIndex] || []}
                  initialValue={initialGrid?.[rowIndex]?.[colIndex]}
                />
              );
            })}
          </View>
        ))}

        <View className="absolute inset-0">
          {[1, 2].map((i) => (
            <View
              key={`h-${i}`}
              className="absolute left-0 right-0 h-[2px] bg-[#424550]"
              style={{ top: `${(i * 100) / 3}%` }}
            />
          ))}
          {[1, 2].map((i) => (
            <View
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-[2px] bg-[#424550]"
              style={{ left: `${(i * 100) / 3}%` }}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

export default React.memo(SudokuBoard);
