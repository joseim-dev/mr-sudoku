import { useAd } from "@/contexts/AdContext/AdContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function WordleLobby() {
  const router = useRouter();

  const { showStartAd, isStartAdLoaded, isStartAdClosed } = useAd();

  const handleStart = async () => {
    if (isStartAdLoaded) {
      showStartAd();
    } else {
      router.push("/(games)/wordle");
    }
  };

  useEffect(() => {
    if (isStartAdClosed) {
      router.push("/(games)/wordle");
    }
  }, [isStartAdClosed]);

  const handleNewGame = async () => {
    try {
      await AsyncStorage.removeItem("wordleSavedGame");
    } catch (e) {
      Alert.alert(
        "Error occurred while generating new game",
        "Please try again. "
      );
    }

    if (isStartAdLoaded) {
      showStartAd();
    } else {
      router.push("/(games)/wordle");
    }
  };

  return (
    <View className="w-full h-full bg-[#412C0D] flex-1">
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
          Wordle
        </Text>
        <Text className="text-[22px] font-[nunito] font-medium text-white mt-3">
          Guess the 5 letter word.
        </Text>
      </View>

      {/* 글자 수 선택 버튼 */}
      <View className="w-full h-[59%] flex items-center py-8">
        <TouchableOpacity
          className="w-[50%] h-[56px] border-[2px] border-[#C5723F] rounded-full flex justify-center items-center mb-5"
          activeOpacity={0.85}
          onPress={() => handleStart()}
        >
          <Text className="text-[20px] font-[nunito] font-bold text-white">
            Continue Game
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[50%] h-[56px] bg-[#C5723F] rounded-full flex justify-center items-center mb-5"
          activeOpacity={0.85}
          onPress={handleNewGame}
        >
          <Text className="text-[20px] font-[nunito] font-bold text-white">
            New Game
          </Text>
        </TouchableOpacity>
      </View>

      {/* 하단 여백 */}
      <View className="w-full h-[10%]" />
    </View>
  );
}
