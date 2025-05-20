import "react-native-reanimated";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";

import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PostHogProvider } from "posthog-react-native";
import { Image } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        console.log("AdMob 초기화 완료");
      });
  }, []);

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Nunito: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PostHogProvider
      apiKey="phc_DNkVN0Ht7hQ6mn42uo6x8cfm8yvvifziJ53GyKlkR8v"
      options={{
        host: "https://us.i.posthog.com",
      }}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(games)" options={{ headerShown: false }} />

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
                  style={{ width: 160, height: 40, resizeMode: "contain" }}
                />
              ),
              headerLeft: () => null, // ← 🔥 완전히 제거!
              headerBackVisible: false, // ← 핵심! 🔥 뒤로가기 버튼 및 title 모두 제거
            }}
          />
          <Stack.Screen
            name="stamps"
            options={{
              headerStyle: {
                backgroundColor: "#FDF6E5",
              },
              headerTitle: () => (
                <Image
                  source={require("../assets/images/mr_sudoku.png")}
                  style={{ width: 160, height: 40, resizeMode: "contain" }}
                />
              ),
              // headerLeft: () => null,
              headerBackVisible: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PostHogProvider>
  );
}
