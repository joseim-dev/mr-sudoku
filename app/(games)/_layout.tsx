import { Stack } from "expo-router";

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
        name="wordle"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sudoku"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
