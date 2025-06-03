import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const GameHeader = ({ onPress }: { onPress: () => void }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <View className="w-full h-[12%] flex-row justify-between items-end pb-4 px-4 ">
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.85}
        className="w-[50px] h-[50px] justify-end"
      >
        <Ionicons
          name="chevron-back"
          size={32}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GameHeader;
