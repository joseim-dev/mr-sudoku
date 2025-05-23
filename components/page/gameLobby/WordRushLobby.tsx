import { useAd } from "@/contexts/AdContext/AdContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function WordRushLobby() {
  const router = useRouter();

  const letterOptions = [4, 5, 6, 7, 8];
  const { showStartAd, isStartAdLoaded, isStartAdClosed, startAdError } =
    useAd();

  const handleSelectLetterCount = async (count: number) => {
    await AsyncStorage.setItem("wordRushLetterCount", count.toString());
    if (isStartAdLoaded) {
      showStartAd();
    } else {
      router.push("/(games)/wordRush");
    }
  };

  useEffect(() => {
    if (isStartAdClosed) {
      router.push("/(games)/wordRush");
    }
  }, [isStartAdClosed]);

  return (
    <View className="w-full h-full bg-[#1B3145] flex-1">
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
          Word Rush
        </Text>
        <Text className="text-[18px] font-[nunito] font-medium text-white mt-3">
          Select word length.
        </Text>
      </View>

      {/* 글자 수 선택 버튼 */}
      <View className="w-full h-[59%] flex items-center py-8">
        {letterOptions.map((count) => (
          <TouchableOpacity
            key={count}
            className="w-[50%] h-[50px] bg-[#6398DA] rounded-full flex justify-center items-center mb-5"
            activeOpacity={0.85}
            onPress={() => handleSelectLetterCount(count)}
          >
            <Text className="text-[18px] font-[nunito] font-bold text-white">
              {count} Letters
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 하단 여백 */}
      <View className="w-full h-[10%]" />
    </View>
  );
}
