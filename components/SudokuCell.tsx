import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

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

const lightTheme = {
  cellBackground: "#FCF7E7",
  selectedCell: "#CCEEC8",
  mistakeCell: "#fdd",
  cellText: "#000",
  memoText: "#999",
  userCorrectCell: "#1A5CD7",
  highlightedCell: "#CCEEC650",
  matchedNumberCell: "#CCEEC8",
  mistakeText: "#DC5555",
  borderColor: "#ccc",
};

const darkTheme = {
  cellBackground: "#121212",
  selectedCell: "#334d34",
  mistakeCell: "#5c2c2c",
  cellText: "#A1A1A1",
  memoText: "#bbb",
  userCorrectCell: "#42965B",
  highlightedCell: "#334d3450",
  matchedNumberCell: "#334d34",
  mistakeText: "#FF6B6B",
  borderColor: "#444",
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
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    cell: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.cellBackground,
      borderColor: theme.borderColor,
      borderWidth: 0.5,
    },
    selectedCell: {
      backgroundColor: theme.selectedCell,
    },
    mistakeCell: {
      backgroundColor: theme.mistakeCell,
    },
    cellText: {
      fontSize: 28,
      fontWeight: "400",
      color: theme.cellText,
    },
    userCorrectCell: {
      color: theme.userCorrectCell,
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
      color: theme.memoText,
    },
    highlightedCell: {
      backgroundColor: theme.highlightedCell,
    },
    matchedNumberCell: {
      backgroundColor: theme.matchedNumberCell,
    },
    mistakeText: {
      color: theme.mistakeText,
      fontWeight: "600",
    },
  });

  const isUserInput =
    initialValue === null || typeof initialValue === "undefined";

  const content = useMemo(() => {
    if (value !== null) {
      return (
        <Text
          style={[
            styles.cellText,
            isUserInput && styles.userCorrectCell,
            isMistake && styles.mistakeText,
          ]}
        >
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
        isHighlighted && styles.highlightedCell,
        isMatchedNumber && styles.matchedNumberCell,
        selected && styles.selectedCell,
        isMistake && styles.mistakeCell,
      ]}
      onPress={() => onSelect(row, col)}
    >
      {content}
    </TouchableOpacity>
  );
};

export default React.memo(SudokuCell);
