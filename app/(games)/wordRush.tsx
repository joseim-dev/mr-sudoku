import wordDataRaw from "@/assets/data/filtered_words_dictionary.json";
import WordRushButton from "@/components/page/games/wordRush/WordRushButton";
import { wordRushRewardedAdId } from "@/constants/adIds";
import { LETTER_TIMER_MAP } from "@/constants/wordRushTimer";
import { fetchWordList, shuffleArray } from "@/utils/wordRush/wordUtils";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { useRewardedAd } from "react-native-google-mobile-ads";

export default function WordRushScreen() {
  const router = useRouter();
  const { isLoaded, isEarnedReward, load, show, isClosed } =
    useRewardedAd(wordRushRewardedAdId);
  const wordData: Record<string, number> = wordDataRaw as Record<
    string,
    number
  >;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [feedbackAnim, setFeedbackAnim] = useState<
    "none" | "correct" | "wrong"
  >("none");
  const [wordList, setWordList] = useState<string[]>([]);
  const [streak, setstreak] = useState(0);
  const [timer, setTimer] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [isFinishTriggered, setIsFinishTriggered] = useState(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    fetchWordList().then((words) => {
      if (words.length > 0) {
        setWordList(words);
      }
    });
    load();
  }, [load]);

  useEffect(() => {
    if (wordList.length === 0) return;
    const word = wordList[currentIndex];
    setCurrentWord(word);
    setScrambledLetters(shuffleArray(word.split("")));
    setSelectedIndexes([]);
    setFeedbackAnim("none");
    setTimer(LETTER_TIMER_MAP[word.length] ?? 10);

    const fetchHighScore = async () => {
      const key = `highScore_${word.length}`;
      const prev = await AsyncStorage.getItem(key);
      setHighScore(prev ? parseInt(prev) : 0);
    };
    fetchHighScore();
    setHint(null);
    setShowHint(false); // 힌트 표시 상태도 초기화 추가!
  }, [currentIndex, wordList]);

  useEffect(() => {
    if (timer <= 0 && !isFinishTriggered) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      saveHighScoreIfNeeded();
      setModalVisible(true);
      return;
    }
    intervalRef.current = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(intervalRef.current as unknown as number);
  }, [timer]);

  useEffect(() => {
    if (wordList.length === 0 || scrambledLetters.length === 0) return;
    const userWord = selectedIndexes.map((i) => scrambledLetters[i]).join("");
    if (userWord.length === currentWord.length) {
      const isCorrect = userWord === currentWord || wordData[userWord];
      if (isCorrect) {
        setFeedbackAnim("correct");
        setstreak((prev) => prev + 1);
        setTimeout(() => {
          if (currentIndex < wordList.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setIsGameEnd(true);
            saveHighScoreIfNeeded();
            setModalVisible(true);
          }
        }, 700);
      } else {
        Haptics.selectionAsync();
        setFeedbackAnim("wrong");
        setTimeout(() => {
          setFeedbackAnim("none");
          setSelectedIndexes([]);
        }, 700);
      }
    }
  }, [selectedIndexes]);

  const saveHighScoreIfNeeded = async () => {
    const key = `highScore_${currentWord.length}`;
    const prev = await AsyncStorage.getItem(key);
    const prevScore = prev ? parseInt(prev) : 0;
    if (streak > prevScore) {
      await AsyncStorage.setItem(key, streak.toString());
      setHighScore(streak);
    }
  };

  const selectedChar = (idx: number) =>
    scrambledLetters[selectedIndexes[idx]]?.toUpperCase() ?? "";

  const getButtonRows = (letters: string[]) => {
    if (letters.length === 4) return [letters];
    const midpoint = Math.ceil(letters.length / 2);
    return [letters.slice(0, midpoint), letters.slice(midpoint)];
  };

  const handleRestart = async () => {
    const words = await fetchWordList();
    setWordList(words);
    setCurrentIndex(0);
    setstreak(0);
    setModalVisible(false);
    setShowAnswer(false);
    setIsGameEnd(false);
    setIsFinishTriggered(false);
  };

  useEffect(() => {
    if (isEarnedReward && isClosed) {
      setModalVisible(false);
      setTimer(LETTER_TIMER_MAP[currentWord.length] ?? 10);
      setShowAnswer(false);
      load();
    }
  }, [isClosed, isEarnedReward]);

  const handleOneMoreChance = async () => {
    if (isLoaded) {
      show();
    } else {
      setModalVisible(false);
      setTimer(LETTER_TIMER_MAP[currentWord.length] ?? 10);
      setShowAnswer(false);
    }
  };

  const handleFinishGame = () => {
    setIsGameEnd(true);
    setIsFinishTriggered(true);
    saveHighScoreIfNeeded();
    setModalVisible(true);
  };

  return (
    <Animatable.View
      className="flex-1 bg-[#FDF6E5]"
      animation={timer <= 0 && !isGameEnd ? "shake" : undefined}
      duration={400}
      iterationCount={1}
      easing="ease-in-out"
    >
      <View className="w-full h-[11%] items-center justify-end pb-1" />
      <View className="w-full h-[12%] justify-end">
        {highScore !== null && (
          <Text className="text-center text-[18px] font-[Nunito] text-gray-500">
            Best Streak: {highScore}
          </Text>
        )}
        <Text className="text-center text-[34px] font-[Nunito] font-bold text-black">
          Streak: {streak}
        </Text>
        <Text className="text-center text-[20px] font-[Nunito] font-bold text-red-600 mt-[3%]">
          {timer}
        </Text>
      </View>
      <View className="w-full h-[30%] justify-center items-center">
        {selectedIndexes.length === 0 ? (
          <Text className="text-[30px] font-[Nunito] text-gray-400 italic">
            Guess the word
          </Text>
        ) : (
          <Animatable.View
            animation={
              feedbackAnim === "correct"
                ? "pulse"
                : feedbackAnim === "wrong"
                ? "shake"
                : undefined
            }
            duration={600}
            iterationCount={1}
          >
            <View className="flex-row justify-center items-center gap-x-3">
              {Array.from({ length: currentWord.length }).map((_, idx) => (
                <Text
                  key={idx}
                  className={`text-[44px] font-[Nunito] font-bold ${
                    feedbackAnim === "wrong"
                      ? "text-red-600"
                      : feedbackAnim === "correct"
                      ? "text-green-600"
                      : "text-black"
                  }`}
                >
                  {selectedChar(idx)}
                </Text>
              ))}
            </View>
          </Animatable.View>
        )}

        {currentWord.length >= 6 && (
          <TouchableOpacity
            onPress={() => {
              if (!hint) {
                const indices = shuffleArray([
                  ...Array(currentWord.length).keys(),
                ]).slice(0, 2);
                const generatedHint = currentWord
                  .split("")
                  .map((char, idx) =>
                    indices.includes(idx) ? char.toUpperCase() : "_"
                  )
                  .join(" ");
                setHint(generatedHint);
              }
              setShowHint((prev) => !prev);
            }}
            className="mt-4"
          >
            <Text className="text-[20px] font-[Nunito] text-[#888] italic mt-[16px]">
              {showHint ? hint : "Tap for hint"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="w-full h-[26%] justify-start items-center px-4 gap-y-4">
        {getButtonRows(scrambledLetters).map((row, rowIndex) => (
          <View
            key={rowIndex}
            className="flex-row justify-center items-center gap-x-2 mb-2"
          >
            {row.map((char, idxInRow) => {
              const globalIndex =
                rowIndex === 0
                  ? idxInRow
                  : Math.ceil(scrambledLetters.length / 2) + idxInRow;
              const selectedIndex = selectedIndexes.indexOf(globalIndex);
              const isSelected = selectedIndex !== -1;

              return (
                <WordRushButton
                  key={globalIndex}
                  letter={char}
                  selected={isSelected}
                  order={isSelected ? selectedIndex + 1 : undefined}
                  onPress={() => {
                    setSelectedIndexes((prev) =>
                      isSelected
                        ? prev.filter((i) => i !== globalIndex)
                        : prev.length < currentWord.length
                        ? [...prev, globalIndex]
                        : prev
                    );
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
      <View className="w-full h-[8%] justify-start items-center">
        <Text
          onPress={() => setSelectedIndexes([])}
          className="text-center text-[24px] text-underline font-[Nunito] font-medium text-gray-600"
        >
          clear
        </Text>
      </View>
      <View className="w-full h-[13%] justify-center items-center">
        <TouchableOpacity
          className="w-[60%] bg-[#246965] rounded-xl h-[50px] items-center justify-center"
          onPress={() => {
            setModalVisible(true);
            setIsGameEnd(true);
          }}
        >
          <Text className="font-[nunito] text-[24px] text-white font-bold">
            Finish
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-full h-[13%] justify-center items-center">
        <TouchableOpacity
          className="w-[60%] bg-[#246965] rounded-xl h-[50px] items-center justify-center"
          onPress={handleFinishGame}
        >
          <Text className="font-[nunito] text-[24px] text-white font-bold">
            Finish
          </Text>
        </TouchableOpacity>
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
              {isGameEnd ? "Game Finished" : "Game Over"}
            </Text>

            {!isGameEnd && (
              <TouchableOpacity onPress={() => setShowAnswer((prev) => !prev)}>
                <Text className="text-[16px] font-[nunito] text-gray-600 italic mb-6 mt-3">
                  {showAnswer
                    ? currentWord.toUpperCase()
                    : "Tap to see the answer"}
                </Text>
              </TouchableOpacity>
            )}

            {isGameEnd ? (
              <View className="items-center">
                <Text className="text-[20px] font-bold font-[nunito] text-[#2B6D69] my-1">
                  Your Score: {streak}
                </Text>
                {highScore !== null && (
                  <Text className="text-[16px] font-[nunito] text-gray-600 mb-3">
                    Best Score: {highScore}
                  </Text>
                )}
              </View>
            ) : (
              <>
                <TouchableOpacity
                  className="w-full bg-[#265D5A] h-[50px] flex justify-center items-center font-[nunito] rounded-full mb-3"
                  onPress={handleOneMoreChance}
                >
                  <Text className="text-white text-center font-bold text-[16px]">
                    One More Chance?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-full border-[#265D5A] border-[2px] h-[50px]  mb-3  font-[nunito] flex justify-center items-center rounded-full"
                  onPress={handleRestart}
                >
                  <Text className="text-[#265D5A] text-center font-bold text-[16px] font-[nunito]">
                    Restart
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)");
                setModalVisible(false);
                setShowAnswer(false);
              }}
              className="mb-4 mt-3"
            >
              <Ionicons name="home" size={22} color="#2B6D69" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animatable.View>
  );
}
