// components/home/CardScroll.tsx
import React from "react";
import { ImageBackground, ScrollView, View } from "react-native";

const cardImages = [
  require("@/assets/images/home-card-1.png"),
  require("@/assets/images/home-card-2.png"),
  require("@/assets/images/home-card-3.png"),
  require("@/assets/images/home-card-4.png"),
];

export default function CardScroll() {
  return (
    <View className="w-full h-[29%] pl-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {cardImages.map((img, index) => (
          <View
            key={index}
            className="w-[200px] h-full rounded-xl mr-3 overflow-hidden"
          >
            <ImageBackground
              source={img}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
