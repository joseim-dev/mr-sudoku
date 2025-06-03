import { useColorScheme } from "@/hooks/useColorScheme.web";
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // 공통 색상 정의
  const iconDefaultColor = isDark ? "#246965" : "#6E6E6E";
  const iconActiveColor = isDark ? "#52B6AC" : "#007AFF";
  const hintAvailableColor = isDark ? "#246965" : "#6E6E6E";
  const hintUnavailableColor = isDark ? "#555555" : "#AAAAAA";
  const textColor = isDark ? "#737373" : "#6E6E6E";

  return (
    <View className="flex-row justify-around items-center w-full h-fit">
      {/* Undo */}
      <TouchableOpacity className="items-center" onPress={handleUndo}>
        <Ionicons
          name="arrow-undo-outline"
          size={28}
          color={iconDefaultColor}
        />
        <Text className="text-sm mt-1" style={{ color: textColor }}>
          Undo
        </Text>
      </TouchableOpacity>

      {/* Hint */}
      <TouchableOpacity className="items-center" onPress={handleHint}>
        <View className="relative">
          <Ionicons
            name="bulb-outline"
            size={28}
            color={hintCount > 0 ? hintAvailableColor : hintUnavailableColor}
          />
          <View className="absolute -top-1.5 -right-2.5 bg-[#FF6D00] rounded-full w-4 h-4 justify-center items-center">
            <Text className="text-white text-[8px] font-bold">
              {hintCount > 0 ? hintCount : "AD"}
            </Text>
          </View>
        </View>
        <Text className="text-sm mt-1" style={{ color: textColor }}>
          Hint
        </Text>
      </TouchableOpacity>

      {/* Memo */}
      <TouchableOpacity
        className="items-center"
        onPress={() => setMemoMode((prev) => !prev)}
      >
        <Ionicons
          name="pencil-outline"
          size={28}
          color={memoMode ? iconActiveColor : iconDefaultColor}
        />
        <Text className="text-sm mt-1" style={{ color: textColor }}>
          Memo
        </Text>
      </TouchableOpacity>

      {/* Erase */}
      <TouchableOpacity
        className="items-center"
        onPress={() => handleNumberSelect(null)}
      >
        <Ionicons name="backspace-outline" size={28} color={iconDefaultColor} />
        <Text className="text-sm mt-1" style={{ color: textColor }}>
          Erase
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SudokuToolBar;
