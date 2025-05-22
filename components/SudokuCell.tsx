import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  value: number | null;
  row: number;
  col: number;
  selected: boolean;
  isMistake: boolean;
  isHighlighted?: boolean;
  onSelect: (row: number, col: number) => void;
  notes: number[];
  initialValue: number | null | undefined;
  isMatchedNumber?: boolean;
};

const SudokuCell = ({
  value,
  row,
  col,
  selected,
  isMistake,
  isHighlighted,
  onSelect,
  notes,
  initialValue,
  isMatchedNumber,
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
        { borderColor: "#ccc", borderWidth: 0.5 },
        // 스타일 적용 순서가 중요! 뒤에 있는 스타일이 앞의 스타일을 덮어씁니다.
        isHighlighted && styles.highlightedCell,
        isMatchedNumber && styles.matchedNumberCell,
        isMistake && styles.mistakeCell,
        selected && styles.selectedCell, // selected가 가장 마지막이어야 함
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
  },
  selectedCell: {
    backgroundColor: "#CCE4FF",
  },
  mistakeCell: {
    backgroundColor: "#fdd",
  },
  cellText: {
    fontSize: 28,
    fontWeight: "400",
    color: "#000",
  },
  userCorrectCell: {
    color: "#1A5CD7",
    fontWeight: "600",
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
  highlightedCell: {
    backgroundColor: "#F0F0F0",
  },
  matchedNumberCell: {
    backgroundColor: "#DEDEDE", // 연한 파랑, 투명도 있음
  },
});
