import { Stack } from "expo-router";
import { Image } from "react-native";

export default function GamesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#1e1e1e" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="wordRush"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sudoku"
        options={{
          headerStyle: {
            backgroundColor: "#FDF6E5",
          },
          headerTitle: () => (
            <Image
              source={require("@/assets/images/mustache.png")}
              style={{ width: 160, height: 40, resizeMode: "contain" }}
            />
          ),
          headerLeft: () => null, // ← 🔥 완전히 제거!
          headerBackVisible: false, // ← 핵심! 🔥 뒤로가기 버튼 및 title 모두 제거
        }}
      />
    </Stack>
  );
}
