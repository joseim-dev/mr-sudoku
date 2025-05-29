import React from "react";
import { Text, View } from "react-native";

type LetterStatus = "correct" | "present" | "absent";

type Props = {
  guesses: string[]; // 예: ["HELLO", "WORLD", ...]
  currentGuess: string; // 현재 입력 중인 단어
  colors: LetterStatus[][]; // 각 guess의 색상 결과
  maxTurns?: number; // 기본 6
};

const getBoxColor = (status?: LetterStatus) => {
  switch (status) {
    case "correct":
      return "#7DC476"; // 초록
    case "present":
      return "#E0C966"; // 노랑
    case "absent":
      return "#999EA0"; // 회색
    default:
      return "#ffffff"; // 기본 흰색
  }
};

const WordleBoard = ({
  guesses,
  currentGuess,
  colors,
  maxTurns = 6,
}: Props) => {
  const totalRows = Array.from({ length: maxTurns }, (_, rowIndex) => {
    const guess =
      guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : "");
    const letters = guess.padEnd(5).split("");
    const rowColors = Array.isArray(colors) ? colors[rowIndex] || [] : [];

    return (
      <View
        key={rowIndex}
        className="flex-row justify-center items-center mb-2 gap-x-2 w-full"
      >
        {letters.map((letter, colIndex) => {
          const bgColor = getBoxColor(rowColors[colIndex]);

          return (
            <View
              key={colIndex}
              className="w-[17%] aspect-square border border-gray-400 rounded-md justify-center items-center"
              style={{ backgroundColor: bgColor }}
            >
              <Text className="text-3xl font-bold text-black">{letter}</Text>
            </View>
          );
        })}
      </View>
    );
  });

  return <View className="flex justify-center items-center">{totalRows}</View>;
};

export default WordleBoard;
