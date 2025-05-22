import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarActiveTintColor: "#265D5A",

        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "#FDF6E5",
            borderTopWidth: 1, // ✅ 상단 테두리 추가
            borderTopColor: "#D1D5DB", // ✅ 회색 (Tailwind 'gray-300'에 해당)
            elevation: 0,
          },
          android: {
            backgroundColor: "#FDF6E5",
            borderTopWidth: 1,
            borderTopColor: "#D1D5DB",
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
