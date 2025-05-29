import SudokuLobby from "@/components/page/gameLobby/SudokuLobby";
import WordleLobby from "@/components/page/gameLobby/WodleLobby";
import WordRushLobby from "@/components/page/gameLobby/WordRushLobby";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const GameLobby = () => {
  const { gameName } = useLocalSearchParams();

  return (
    <View className="w-full h-full">
      {gameName === "sudoku" ? (
        <SudokuLobby />
      ) : gameName === "wordRush" ? (
        <WordRushLobby />
      ) : gameName === "wordle" ? (
        <WordleLobby />
      ) : null}
    </View>
  );
};

export default GameLobby;
