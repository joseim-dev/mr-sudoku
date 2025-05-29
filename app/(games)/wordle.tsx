import wordDataRaw from "@/assets/data/filtered_words_dictionary.json";
import WordleBoard from "@/components/page/games/wordle/WordleBoard";
import WordleKeyboard from "@/components/page/games/wordle/WordleKeyboard";
import WordleKeyboardSmallDevice from "@/components/page/games/wordle/WordleKeyboardSmallDevice";
import GameHeader from "@/components/ui/GameHeader";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { generate } from "random-words";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type LetterStatus = "correct" | "present" | "absent";
type KeyStatusMap = Record<string, LetterStatus>;

export default function Wordle() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [colors, setColors] = useState<LetterStatus[][]>([]);
  const [keyStatus, setKeyStatus] = useState<KeyStatusMap>({});
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const wordData: Record<string, number> = wordDataRaw as Record<
    string,
    number
  >;
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const isSmallDevice = screenWidth < 390;

  useEffect(() => {
    const loadGame = async () => {
      const saved = await AsyncStorage.getItem("wordleSavedGame");
      if (saved) {
        const data = JSON.parse(saved);
        setAnswer(data.answer);
        setGuesses(data.guesses);
        setCurrentGuess(data.currentGuess);
        setColors(data.colors);
        setKeyStatus(data.keyStatus);
      } else {
        const randomWord = generate({
          exactly: 1,
          minLength: 5,
          maxLength: 5,
          wordsPerString: 1,
        })[0].toUpperCase();
        setAnswer(randomWord);
      }
    };
    loadGame();
  }, []);

  useEffect(() => {
    const saveGame = async () => {
      const gameData = {
        answer,
        guesses,
        currentGuess,
        colors,
        keyStatus,
      };
      await AsyncStorage.setItem("wordleSavedGame", JSON.stringify(gameData));
    };
    if (!isGameEnd) saveGame();
  }, [guesses, currentGuess, colors, keyStatus]);

  const evaluateGuess = (guess: string, answer: string): LetterStatus[] => {
    const result: LetterStatus[] = Array(5).fill("absent");
    const answerChars = answer.split("");
    const guessChars = guess.split("");

    guessChars.forEach((char, i) => {
      if (char === answerChars[i]) {
        result[i] = "correct";
        answerChars[i] = "";
      }
    });

    guessChars.forEach((char, i) => {
      if (result[i] === "correct") return;
      const indexInAnswer = answerChars.indexOf(char);
      if (indexInAnswer !== -1) {
        result[i] = "present";
        answerChars[indexInAnswer] = "";
      }
    });

    return result;
  };

  const updateKeyStatus = (
    prev: KeyStatusMap,
    guess: string,
    result: LetterStatus[]
  ): KeyStatusMap => {
    const priority: Record<LetterStatus, number> = {
      correct: 3,
      present: 2,
      absent: 1,
    };

    const newStatus = { ...prev };

    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const status = result[i];

      const currentPriority = priority[newStatus[letter] || "absent"];
      const nextPriority = priority[status];

      if (!newStatus[letter] || nextPriority > currentPriority) {
        newStatus[letter] = status;
      }
    }

    return newStatus;
  };

  const handleKeyPress = (key: string) => {
    if (key === "DEL") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const MAX_TURNS = 6;

  const handleSubmit = () => {
    if (currentGuess.length === 5) {
      if (!wordData[currentGuess.toLowerCase()]) {
        Alert.alert("Not in word list", "Please type a valid word");
        return;
      }

      const feedback = evaluateGuess(currentGuess, answer);
      const nextGuesses = [...guesses, currentGuess];

      setGuesses(nextGuesses);
      setColors((prev) => [...prev, feedback]);
      setKeyStatus((prev) => updateKeyStatus(prev, currentGuess, feedback));

      const didWin = currentGuess === answer;
      const didFail = nextGuesses.length === MAX_TURNS && !didWin;

      if (didWin || didFail) {
        setIsCorrect(didWin);
        setIsGameEnd(true);
        setModalVisible(true);
        // 저장된 게임 삭제
        AsyncStorage.removeItem("wordleSavedGame").catch((e) =>
          console.error("Failed to remove saved game:", e)
        );
      }

      setCurrentGuess("");
    }
  };

  const handleRestart = async () => {
    await AsyncStorage.removeItem("wordleSavedGame");
    const newWord = generate({
      exactly: 1,
      minLength: 5,
      maxLength: 5,
      wordsPerString: 1,
    })[0].toUpperCase();
    setAnswer(newWord);
    setGuesses([]);
    setColors([]);
    setKeyStatus({});
    setCurrentGuess("");
    setModalVisible(false);
    setIsGameEnd(false);
  };

  return (
    <View className="w-full h-full bg-[#FDF5E5]">
      <GameHeader
        onPress={async () => {
          const gameData = {
            answer,
            guesses,
            currentGuess,
            colors,
            keyStatus,
          };
          await AsyncStorage.setItem(
            "wordleSavedGame",
            JSON.stringify(gameData)
          );
          Alert.alert("Game Saved!");
        }}
      />
      <View className="w-full h-[53%] justify-center items-center">
        <View className="w-[90%]">
          <WordleBoard
            guesses={guesses}
            currentGuess={currentGuess}
            colors={colors}
          />
        </View>
      </View>
      <View className="w-full h-[35%] justify-between items-center pb-8">
        {isSmallDevice ? (
          <WordleKeyboardSmallDevice
            onKeyPress={handleKeyPress}
            keyStatus={keyStatus}
          />
        ) : (
          <>
            <View className="w-full h-[80%] items-center ">
              <WordleKeyboard
                onKeyPress={handleKeyPress}
                keyStatus={keyStatus}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="h-[17%] bg-[#357A4A] w-[60%] rounded-2xl justify-center items-center"
            >
              <Text className="font-[Nunito] font-bold text-2xl text-white">
                Submit
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 bg-white/90 justify-center items-center">
          <View className="bg-white w-[80%] py-4 px-6 rounded-2xl items-center border-4 border-[#2B6D69]">
            <Image
              source={require("@/assets/images/mustache.png")}
              className="w-[50px] h-[50px] mb-4"
              resizeMode="contain"
            />
            <Text className="text-[30px] font-extrabold text-[#1B3145] mb-2 font-[nunito]">
              {isCorrect ? "Mustache!" : "Game Over"}
            </Text>

            <Text className="text-[18px] text-gray-600 font-[nunito] mb-6">
              Answer: {answer}
            </Text>

            <TouchableOpacity
              onPress={handleRestart}
              className="w-full bg-[#265D5A] h-[50px] flex justify-center items-center font-[nunito] rounded-full mb-3"
            >
              <Text className="text-white text-center font-semibold text-[16px]">
                Restart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)");
                setModalVisible(false);
              }}
              className="mb-4 mt-3"
            >
              <Ionicons name="home" size={22} color="#2B6D69" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
