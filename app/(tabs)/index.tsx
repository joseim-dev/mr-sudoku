import React from "react";

import GameCard from "@/components/page/home/GameCard";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  ImageBackground,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[#FDF6E5] justify-start items-center ">
      <View className="h-[12%] w-full flex justify-end items-center pb-4">
        <ImageBackground
          source={require("@/assets/images/mustache.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
      </View>

      <View className="h-[24%] w-full flex justify-center items-center">
        <View className="w-full h-[80%] flex justify-center items-center">
          <Text className="text-[50px] text-[#246965] font-[nunito] font-black text-center pt-4">
            MUSTACHE
          </Text>
        </View>
        <View className="w-full h-[20%] flex justify-center items-center px-4">
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.instagram.com/itsmrsudoku/")
            }
            className="flex-row items-center justify-center mt-2"
          >
            <Ionicons name="logo-instagram" size={20} color="#7D7D7D" />
            <Text className="ml-2 text-[18px] font-[Nunito] text-[#7D7D7D] font-semibold">
              itsmrsudoku
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-[30%] w-full flex-row items-center justify-center android:h-[34%] px-2 gap-[2%] ">
        <GameCard
          title="MR.SUDOKU"
          image={require("@/assets/images/card-mustache.png")}
          gameName="sudoku"
        />
        <GameCard
          title="Word Rush"
          image={require("@/assets/images/card-wordRush.png")}
          borderColor="#355B7A"
          cardColor="#1B2A4D"
          buttonColor="#6398DA"
          gameName="wordRush"
        />
      </View>
      <View className="h-[28%] w-full px-4 flex justify-start items-center">
        <View className="w-full aspect-[2]">
          <Image
            style={{ width: "100%", height: "100%" }} // className 대신 style 사용
            source={{
              uri: "https://ljgohbrmnjtyvkyimdyb.supabase.co/storage/v1/object/public/elements//home-main-card.png",
            }}
            contentFit="contain" // resizeMode에 해당
            transition={300} // optional: 로딩 시 fade-in 효과
            placeholder={require("@/assets/images/home-main-card.png")} // optional: 로딩 중 이미지
            placeholderContentFit="contain" // optional: 로딩 중 이미지 resizeMode
            cachePolicy="none"
          />
        </View>
      </View>

      {Platform.OS === "ios" ? (
        <View className="w-full h-[6%] bg-slate-500" />
      ) : null}
    </View>
  );
}
