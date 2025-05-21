import SudokuLobby from "@/components/page/gameLobby/SudokuLobby";
import WordRushLobby from "@/components/page/gameLobby/WordRushLobby";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const GameLobby = () => {
  const { gameName } = useLocalSearchParams();

  return (
    <View className="w-full h-full">
      {gameName === "sudoku" ? <SudokuLobby /> : <WordRushLobby />}
    </View>
  );
};

export default GameLobby;
