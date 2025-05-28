import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SudokuButtonProps {
  isSmallDevice: boolean;
  handleSave: () => void;
}

const SudokuButton: React.FC<SudokuButtonProps> = ({
  isSmallDevice,
  handleSave,
}) => {
  return (
    <View className="h-full flex-row justify-center items-start">
      <TouchableOpacity
        className="w-[65%] bg-[#265D5A] rounded-full justify-center items-center shadow-md"
        style={{ height: isSmallDevice ? 40 : 50, elevation: 6 }}
        onPress={handleSave}
        activeOpacity={0.9}
      >
        <Text
          className="text-white font-bold"
          style={{ fontSize: isSmallDevice ? 16 : 18, fontFamily: "Nunito" }}
        >
          Save Game
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SudokuButton;
