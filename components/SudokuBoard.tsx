import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import SudokuCell from "./SudokuCell"; // 새로운 셀 컴포넌트

type Grid = (number | null)[][];

type Props = {
  grid: Grid;
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  mistakeCells?: { row: number; col: number }[];
  memoGrid?: number[][][];
  initialGrid?: Grid;
};

function SudokuBoard({
  grid,
  selectedCell,
  onCellSelect,
  mistakeCells = [],
  memoGrid = [],
  initialGrid,
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
    <Animated.View
      style={[styles.board, { transform: [{ translateX: shakeAnim }] }]}
    >
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => {
            const selected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
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
      <View style={StyleSheet.absoluteFill}>
        {[1, 2].map((i) => (
          <View
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: `${(i * 100) / 3}%`,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: "#424550",
            }}
          />
        ))}
        {[1, 2].map((i) => (
          <View
            key={`v-${i}`}
            style={{
              position: "absolute",
              left: `${(i * 100) / 3}%`,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: "#424550",
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
}

export default React.memo(SudokuBoard);

const styles = StyleSheet.create({
  board: {
    aspectRatio: 1,
    width: "100%",
    borderColor: "#424550",
    borderWidth: 2,
    marginVertical: 5,
    marginBottom: 20,
    backgroundColor: "#FDF6E5",
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
});
