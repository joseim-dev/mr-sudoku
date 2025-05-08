import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Grid = (number | null)[][];

type Props = {
  grid: Grid;
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  mistakeCells?: { row: number; col: number }[];
  memoGrid?: number[][][];
  solutionGrid?: Grid;
  initialGrid?: Grid;
};

export default function SudokuBoard({
  grid,
  selectedCell,
  onCellSelect,
  mistakeCells = [],
  memoGrid = [],
  solutionGrid,
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
  }, [mistakeCells, shakeAnim]);

  return (
    <Animated.View
      style={[styles.board, { transform: [{ translateX: shakeAnim }] }]}
    >
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

            const isMistake = mistakeCells.some(
              (cell) => cell.row === rowIndex && cell.col === colIndex
            );

            const cellValue = value;
            const notes = memoGrid?.[rowIndex]?.[colIndex] || [];

            const isUserInput =
              initialGrid?.[rowIndex]?.[colIndex] === null ||
              typeof initialGrid?.[rowIndex]?.[colIndex] === "undefined";

            // const isUserCorrect =
            //   value !== null &&
            //   solutionGrid?.[rowIndex]?.[colIndex] === value &&
            //   isUserInput;

            return (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  isSelected && styles.selectedCell,
                  isMistake && styles.mistakeCell,
                  {
                    borderColor: "#ccc",
                    borderWidth: 0.5,
                  },
                ]}
                onPress={() => onCellSelect(rowIndex, colIndex)}
              >
                {cellValue !== null ? (
                  <Text
                    style={[
                      styles.cellText,
                      isUserInput && styles.userCorrectCell,
                    ]}
                  >
                    {cellValue}
                  </Text>
                ) : notes.length > 0 ? (
                  <View style={styles.memoContainer}>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                      <Text key={n} style={styles.memoText}>
                        {notes.includes(n) ? n : " "}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </TouchableOpacity>
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
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF6E5",
  },
  selectedCell: {
    backgroundColor: "#eef",
  },
  mistakeCell: {
    backgroundColor: "#fdd",
  },
  cellText: {
    fontSize: 24,
    fontWeight: "300",
    color: "#000",
  },
  userCorrectCell: {
    color: "#1A5CD7", // 남색
    fontWeight: "500",
  },
  memoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  memoText: {
    fontSize: 10,
    width: "33%",
    textAlign: "center",
    color: "#999",
  },
});
