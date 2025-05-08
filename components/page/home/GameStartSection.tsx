// components/home/GameStartSection.tsx
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  savedTime: number | null;
  onContinue: () => void;
  onStart: () => void;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function GameStartSection({
  savedTime,
  onContinue,
  onStart,
}: Props) {
  return (
    <View className="w-full h-[30%] items-center">
      {savedTime !== null && (
        <TouchableOpacity
          className="w-[85%] h-[50px] bg-[#4E4E4E] rounded-full items-center justify-center mb-3"
          onPress={onContinue}
        >
          <Text className="text-white text-[18px] font-bold font-nunito">
            Continue Game ({formatTime(savedTime)})
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="w-[85%] h-[50px] bg-[#265D5A] rounded-full items-center justify-center shadow-md"
        onPress={onStart}
        activeOpacity={0.8}
      >
        <Text className="text-white text-[18px] font-bold font-nunito">
          Start New Game
        </Text>
      </TouchableOpacity>
    </View>
  );
}
