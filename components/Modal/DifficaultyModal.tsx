// components/home/DifficultyModal.tsx
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  difficulties: { key: string; label: string; base: string }[];
  userExp: number;
  levelRequirements: Record<string, number>;
  onSelect: (key: string, base: string) => void;
}

export default function DifficultyModal({
  visible,
  onClose,
  difficulties,
  userExp,
  levelRequirements,
  onSelect,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white rounded-2xl px-6 py-6 w-4/5 items-center">
          <Text className="text-xl font-bold font-nunito mb-5">
            Select Difficulty
          </Text>

          {difficulties.map((level) => {
            const requiredExp = levelRequirements[level.key];
            const locked = userExp < requiredExp;
            return (
              <TouchableOpacity
                key={level.key}
                className={`w-[90%] rounded-xl py-6 mb-[10px] items-center shadow-sm h-[45px] ${
                  locked ? "bg-[#bbb]" : "bg-[#265D5A]"
                }`}
                disabled={locked}
                onPress={() => onSelect(level.key, level.base)}
              >
                <Text
                  className={`text-md font-medium font-nunito ${
                    locked ? "text-[#eee]" : "text-white"
                  }`}
                >
                  {level.label}
                  {locked ? ` (${requiredExp} EXP)` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity onPress={onClose}>
            <Text className="mt-4 text-sm text-[#777]">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
