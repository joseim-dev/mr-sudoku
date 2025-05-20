import { Stack } from "expo-router";
import { Image } from "react-native";

export default function GamesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#1e1e1e" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="wordRush"
        options={{
          headerStyle: {
            backgroundColor: "#FDF6E5",
          },
          headerTitle: () => (
            <Image
              source={require("@/assets/images/mr_sudoku.png")}
              style={{ width: 160, height: 40, resizeMode: "contain" }}
            />
          ),
          headerLeft: () => null, // ← 🔥 완전히 제거!
          headerBackVisible: false, // ← 핵심! 🔥 뒤로가기 버튼 및 title 모두 제거
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: "#FDF6E5",
          },
          headerTitle: () => (
            <Image
              source={require("@/assets/images/mr_sudoku.png")}
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
