import AdCard from "@/components/page/home/AdCard";
import GameCard from "@/components/page/home/GameCard";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  FlatList,
  ImageBackground,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const data = [{}]; // 스크롤용 더미 데이터

  const renderContent = () => (
    <View className="flex bg-[#FDF6E5] items-center">
      <View className="py-6 w-full items-center h-[110px] justify-end">
        <ImageBackground
          source={require("@/assets/images/mustache.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
      </View>

      <View className="w-full items-center justify-center mb-4 h-[260px]">
        <Text className="text-[50px] text-[#246965] font-[nunito] font-black text-center">
          MUSTACHE
        </Text>
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

      <View className="w-full flex-row justify-center px-2 gap-[2%] mb-6 ">
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
      <View className="w-full flex-row justify-center px-2 gap-[2%] mb-6 ">
        <GameCard
          title="Wordle?!"
          image={require("@/assets/images/wordle-icon.png")}
          borderColor="#C5723F"
          cardColor="#412C0D"
          buttonColor="#C5723F"
          gameName="wordle"
        />
        <AdCard
          title="Instagram"
          borderColor="#C53F8F"
          cardColor="#410D2F"
          buttonColor="#C53F8F"
          gameName="wordle"
        />
      </View>

      <View className="w-full px-4 mb-6">
        <View className="w-full aspect-[2]">
          <Image
            style={{ width: "100%", height: "100%" }}
            source={{
              uri: "https://ljgohbrmnjtyvkyimdyb.supabase.co/storage/v1/object/public/elements//home-main-card.png",
            }}
            contentFit="contain"
            transition={300}
            placeholder={require("@/assets/images/home-main-card.png")}
            placeholderContentFit="contain"
            cachePolicy="none"
          />
        </View>
      </View>

      {Platform.OS === "ios" ? <View className="w-full h-[100px] " /> : null}
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={() => null}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={renderContent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}
