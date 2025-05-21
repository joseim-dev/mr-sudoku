import React from "react";

import GameCard from "@/components/page/home/GameCard";
import { ImageBackground, Platform, Text, View } from "react-native";

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
        <Text className="text-[50px] text-[#246965] font-[nunito] font-black text-center pt-4">
          MUSTACHE
        </Text>
      </View>
      <View className="h-[30%] w-full flex-row items-center justify-center android:h-[34%] px-2 gap-[2%]">
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
      <View className="h-[28%] w-full "></View>

      {Platform.OS === "ios" ? (
        <View className="w-full h-[6%] bg-slate-500" />
      ) : null}
    </View>
  );
}
