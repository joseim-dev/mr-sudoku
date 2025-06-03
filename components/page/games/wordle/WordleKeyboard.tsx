import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type LetterStatus = "correct" | "present" | "absent";

type Props = {
  onKeyPress: (key: string) => void;
  keyStatus?: Record<string, LetterStatus>; // 알파벳별 상태값
};

const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "DEL"],
];

const getKeyColor = (status?: LetterStatus) => {
  switch (status) {
    case "correct":
      return "#7DC476"; // 초록
    case "present":
      return "#E0C966"; // 노랑
    case "absent":
      return "#999EA0"; // 회색
    default:
      return "#DEDDDD"; // 기본 흰색
  }
};

export default function WordleKeyboard({ onKeyPress, keyStatus = {} }: Props) {
  return (
    <View className="w-full h-full justify-center items-center px-1">
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          className="flex-row justify-center items-between w-full  mb-3"
        >
          {row.map((key) => {
            const status = keyStatus[key];
            const bgColor = getKeyColor(status);

            return (
              <TouchableOpacity
                key={key}
                onPress={() => onKeyPress(key)}
                className="px-2 py-4 rounded-md justify-center items-center mx-[2px] border-[1px] border-gray-300"
                style={{
                  minWidth: key === "DEL" ? 50 : 35,
                  backgroundColor: bgColor,
                }}
                activeOpacity={0.8}
              >
                <Text className="text-xl font-extrabold font-[Nunito] text-black ">
                  {key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
