import "react-native-reanimated";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "react-native"; // ✅ 이미지 컴포넌트 import

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Nunito: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="game"
          options={{
            headerStyle: {
              backgroundColor: "#FDF6E5",
            },
            headerTitle: () => (
              <Image
                source={require("../assets/images/mr_sudoku.png")}
                style={{ width: 180, height: 40, resizeMode: "contain" }}
              />
            ),
            headerLeft: () => null, // ← 🔥 완전히 제거!
            headerBackVisible: false, // ← 핵심! 🔥 뒤로가기 버튼 및 title 모두 제거
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
