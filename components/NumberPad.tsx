// components/NumberPad.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type NumberPadProps = {
  onSelectNumber: (num: number | null) => void;
};

export default function NumberPad({ onSelectNumber }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.button}
            onPress={() => onSelectNumber(num)}
          >
            <Text style={styles.buttonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, width: "100%" },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    width: 30,
    height: 34,
    margin: 4,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  clearButton: {
    backgroundColor: "#f88",
  },
  buttonText: {
    fontSize: 34,
    fontWeight: "regular",
    color: "#265D5A",
  },
});
