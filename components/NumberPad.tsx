import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NumberPadProps = {
  onSelectNumber: (num: number | null) => void;
};

export default function NumberPad({ onSelectNumber }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const screenWidth = Dimensions.get("window").width;
  const buttonMargin = 4;
  const totalMargin = buttonMargin * 2 * 9; // 각 버튼의 좌우 margin 합
  const buttonWidth = (screenWidth - totalMargin - 32) / 9; // 여백 조정 (양쪽 여백 약간 고려)

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.button, { width: buttonWidth, height: "100%" }]}
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
  container: {
    width: "100%",
    paddingHorizontal: 16, // 양쪽 패딩
    height: 60, // 버튼 높이
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    // backgroundColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 32,
    color: "#265D5A",
  },
});
