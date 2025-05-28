import { useAd } from "@/contexts/AdContext/AdContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SudokuLobby() {
  const router = useRouter();
  const { showStartAd, isStartAdLoaded, isStartAdClosed, startAdError } =
    useAd();
  const [isSavedGame, setIsSavedGame] = React.useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkSavedGame = async () => {
        const saved = await AsyncStorage.getItem("sudokuSavedGame");
        setIsSavedGame(!!saved);
      };

      checkSavedGame();
    }, [])
  );

  const difficulties = [
    { key: "easy", base: "easy" },
    { key: "normal", base: "easy" },
    { key: "medium", base: "medium" },
    { key: "hard", base: "medium" },
    { key: "extreme", base: "hard" },
    { key: "master", base: "hard" },
  ];

  const handleContinueGame = async () => {
    const savedGame = await AsyncStorage.getItem("sudokuSavedGame");
    if (savedGame) {
      if (isStartAdLoaded) {
        showStartAd();
      } else {
        router.push("/(games)/sudoku");
      }
    }
  };

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

    if (isStartAdLoaded) {
      showStartAd();
    } else {
      router.push("/(games)/sudoku");
    }
  };

  useEffect(() => {
    if (isStartAdClosed) {
      router.push("/(games)/sudoku");
    }
  }, [isStartAdClosed]);

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
        <Text className="text-[44px] font-[nunito] font-black text-white">
          Mr.Sudoku
        </Text>
        <Text className="text-[22px] font-[nunito] font-medium text-white mt-3">
          Choose a difficulty.
        </Text>
      </View>
      {/* 난이도 선택 버튼 */}
      <View className="w-full h-[69%]">
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {isSavedGame && (
            <TouchableOpacity
              className="w-[50%] h-[56px] border-[2px] border-[#5FB085] ] rounded-full flex justify-center items-center mb-5"
              activeOpacity={0.85}
              onPress={() => {
                handleContinueGame();
              }}
            >
              <Text className="text-[20px] font-[nunito] font-bold text-white capitalize">
                Continue
              </Text>
            </TouchableOpacity>
          )}
          {difficulties.map((level) => (
            <TouchableOpacity
              key={level.key}
              className="w-[50%] h-[56px] bg-[#5FB085] rounded-full flex justify-center items-center mb-5"
              activeOpacity={0.85}
              onPress={() => handleSelectDifficulty(level.key, level.base)}
            >
              <Text className="text-[20px] font-[nunito] font-bold text-white capitalize">
                {level.key}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* 하단 여백 */}
    </View>
  );
}
