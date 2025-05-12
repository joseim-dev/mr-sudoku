import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  value: number | null;
  row: number;
  col: number;
  selected: boolean;
  isMistake: boolean;
  onSelect: (row: number, col: number) => void;
  notes: number[];
  initialValue: number | null | undefined;
};

const SudokuCell = ({
  value,
  row,
  col,
  selected,
  isMistake,
  onSelect,
  notes,
  initialValue,
}: Props) => {
  const isUserInput =
    initialValue === null || typeof initialValue === "undefined";

  const content = useMemo(() => {
    if (value !== null) {
      return (
        <Text style={[styles.cellText, isUserInput && styles.userCorrectCell]}>
          {value}
        </Text>
      );
    }
    if (notes.length > 0) {
      return (
        <View style={styles.memoContainer}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <Text key={n} style={styles.memoText}>
              {notes.includes(n) ? n : " "}
            </Text>
          ))}
        </View>
      );
    }
    return null;
  }, [value, notes.join(",")]);

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        selected && styles.selectedCell,
        isMistake && styles.mistakeCell,
        { borderColor: "#ccc", borderWidth: 0.5 },
      ]}
      onPress={() => onSelect(row, col)}
    >
      {content}
    </TouchableOpacity>
  );
};

export default React.memo(SudokuCell);

const styles = StyleSheet.create({
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
    fontSize: 26,
    fontWeight: "300",
    color: "#000",
  },
  userCorrectCell: {
    color: "#1A5CD7",
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
