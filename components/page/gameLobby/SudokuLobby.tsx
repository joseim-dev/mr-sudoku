import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function SudokuLobby() {
  const router = useRouter();

  const difficulties = [
    { key: "easy", base: "easy" },
    { key: "normal", base: "easy" },
    { key: "medium", base: "medium" },
    { key: "hard", base: "medium" },
    { key: "extreme", base: "hard" },
    { key: "master", base: "hard" },
  ];

  const handleSelectDifficulty = async (key: string, base: string) => {
    await AsyncStorage.multiRemove([
      "sudokuGrid",
      "sudokuInitialGrid",
      "sudokuSolutionGrid",
      "sudokuTime",
      "sudokuDifficulty",
      "sudokuDifficultyLabel",
      "sudokuSavedGame",
    ]);
    await AsyncStorage.setItem("sudokuDifficulty", base);
    await AsyncStorage.setItem("sudokuDifficultyLabel", key);
    router.push("/(games)/sudoku");
  };

  return (
    <View className="w-full h-full bg-[#1B4529]">
      {/* 상단 헤더 */}
      <View className="w-full h-[12%] flex-row justify-between items-end pb-4 px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          className="w-[50px] h-[50px] justify-end"
        >
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View className="w-full h-[4%]" />

      {/* 게임 이름 및 안내 */}
      <View className="w-full h-[15%] flex justify-center items-center">
        <Text className="text-[40px] font-[nunito] font-black text-white">
          Mr.Sudoku
        </Text>
        <Text className="text-[18px] font-[nunito] font-medium text-white mt-3">
          Choose a difficulty.
        </Text>
      </View>

      {/* 난이도 선택 버튼 */}
      <View className="w-full h-[59%] flex items-center py-8">
        {difficulties.map((level) => (
          <TouchableOpacity
            key={level.key}
            className="w-[50%] h-[50px] bg-[#5FB085] rounded-full flex justify-center items-center mb-5"
            activeOpacity={0.85}
            onPress={() => handleSelectDifficulty(level.key, level.base)}
          >
            <Text className="text-[18px] font-[nunito] font-bold text-white capitalize">
              {level.key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 하단 여백 */}
      <View className="w-full h-[10%]" />
    </View>
  );
}
