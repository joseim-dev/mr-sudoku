import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

type NumberPadProps = {
  onSelectNumber: (num: number | null) => void;
};

export default function NumberPad({ onSelectNumber }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const screenWidth = Dimensions.get("window").width;
  const buttonMargin = 4;
  const totalMargin = buttonMargin * 2 * 9;
  const buttonWidth = (screenWidth - totalMargin - 32) / 9;

  return (
    <View className="w-full h-fit">
      <View className="flex-row justify-center">
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            className="m-1.5 justify-center items-center rounded"
            style={{ width: buttonWidth, height: 36 }}
            onPress={() => onSelectNumber(num)}
          >
            <Text className="text-[36px] text-[#265D5A] font-medium">
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
