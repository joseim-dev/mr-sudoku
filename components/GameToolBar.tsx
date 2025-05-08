// components/GameToolbar.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GameToolbarProps {
  handleUndo: () => void;
  handleHint: () => void;
  handleErase: () => void;
  memoMode: boolean;
  setMemoMode: React.Dispatch<React.SetStateAction<boolean>>;
  hintCount: number;
}

const GameToolBar: React.FC<GameToolbarProps> = ({
  handleUndo,
  handleHint,
  handleErase,
  memoMode,
  setMemoMode,
  hintCount,
}) => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={handleUndo} style={styles.iconButton}>
        <Ionicons name="arrow-undo-outline" size={24} color="#6E6E6E" />
        <Text style={styles.iconLabel}>Undo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleHint} style={styles.iconButton}>
        <Ionicons
          name="bulb-outline"
          size={24}
          color={hintCount > 0 ? "#6E6E6E" : "#aaa"}
        />
        <Text style={styles.iconLabel}>Hint</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setMemoMode((prev) => !prev)}
        style={styles.iconButton}
      >
        <Ionicons
          name="pencil-outline"
          size={24}
          color={memoMode ? "#007AFF" : "#6E6E6E"}
        />
        <Text style={styles.iconLabel}>Memo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleErase} style={styles.iconButton}>
        <Ionicons name="backspace-outline" size={24} color="#6E6E6E" />
        <Text style={styles.iconLabel}>Erase</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    alignItems: "center",
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#6E6E6E",
  },
});

export default GameToolBar;
