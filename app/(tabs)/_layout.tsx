import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#5FB085" : "#265D5A", // 다크모드용 메인컬러
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: colorScheme === "dark" ? "#1D1D1D" : "#FDF6E5", // 다크: mainBlack
            borderTopWidth: 1,
            borderTopColor: colorScheme === "dark" ? "#333" : "#D1D5DB", // 다크: 더 어두운 그레이
            elevation: 0,
          },
          android: {
            backgroundColor: colorScheme === "dark" ? "#1D1D1D" : "#FDF6E5",
            borderTopWidth: 1,
            borderTopColor: colorScheme === "dark" ? "#333" : "#D1D5DB",
            elevation: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Store",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="bag-handle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
