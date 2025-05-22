import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SudokuToolBarProps {
  hintCount: number;
  memoMode: boolean;
  handleUndo: () => void;
  handleHint: () => void;
  setMemoMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleNumberSelect: (value: number | null) => void;
}

const SudokuToolBar: React.FC<SudokuToolBarProps> = ({
  hintCount,
  memoMode,
  handleUndo,
  handleHint,
  setMemoMode,
  handleNumberSelect,
}) => {
  return (
    <View className="flex-row justify-around items-center w-full h-fit">
      <TouchableOpacity className="items-center" onPress={handleUndo}>
        <Ionicons name="arrow-undo-outline" size={28} color="#6E6E6E" />
        <Text className="text-sm mt-1 text-[#6E6E6E]">Undo</Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center" onPress={handleHint}>
        <View className="relative">
          <Ionicons
            name="bulb-outline"
            size={28}
            color={hintCount > 0 ? "#6E6E6E" : "#aaa"}
          />
          <View className="absolute -top-1.5 -right-2.5 bg-[#FF6D00] rounded-full w-4 h-4 justify-center items-center">
            <Text className="text-white text-[8px] font-bold">
              {hintCount > 0 ? hintCount : "AD"}
            </Text>
          </View>
        </View>
        <Text className="text-sm mt-1 text-[#6E6E6E]">Hint</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => setMemoMode((prev) => !prev)}
      >
        <Ionicons
          name="pencil-outline"
          size={28}
          color={memoMode ? "#007AFF" : "#6E6E6E"}
        />
        <Text className="text-sm mt-1 text-[#6E6E6E]">Memo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => handleNumberSelect(null)}
      >
        <Ionicons name="backspace-outline" size={28} color="#6E6E6E" />
        <Text className="text-sm mt-1 text-[#6E6E6E]">Erase</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SudokuToolBar;
