import WordRushButton from "@/components/page/games/wordRush/WordRushButton";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

// 셔플 함수
const shuffleArray = (array: string[]): string[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 단어 리스트 (mock)
const wordList = [
  "moon",
  "love",
  "star",
  "game",
  "ring",
  "book",
  "tree",
  "fish",
  "bird",
  "fire",
  "cake",
  "snow",
  "milk",
  "wind",
  "ship",
  "road",
  "blue",
  "gold",
  "hill",
  "home",
];

export default function WordRushScreen() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [feedbackAnim, setFeedbackAnim] = useState<
    "none" | "correct" | "wrong"
  >("none");

  const wordLength = currentWord.length;

  // 단어 로딩 및 셔플
  useEffect(() => {
    const word = wordList[currentIndex];
    setCurrentWord(word);
    setScrambledLetters(shuffleArray(word.split("")));
    setSelectedIndexes([]);
    setFeedbackAnim("none");
  }, [currentIndex]);

  // 정답 확인
  useEffect(() => {
    const userWord = selectedIndexes.map((i) => scrambledLetters[i]).join("");

    if (userWord.length === currentWord.length) {
      if (userWord === currentWord) {
        setFeedbackAnim("correct");
        setTimeout(() => {
          setFeedbackAnim("none");
          if (currentIndex < wordList.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            alert("🎉 모든 문제를 풀었습니다!");
          }
        }, 700);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setFeedbackAnim("wrong");
        setTimeout(() => {
          setFeedbackAnim("none");
          setSelectedIndexes([]);
        }, 700);
      }
    }
  }, [selectedIndexes]);

  const selectedChar = (idx: number) => {
    const selectedIndex = selectedIndexes[idx];
    if (
      selectedIndex === undefined ||
      scrambledLetters[selectedIndex] === undefined
    ) {
      return "";
    }
    return scrambledLetters[selectedIndex].toUpperCase();
  };

  const getButtonRows = (letters: string[]) => {
    if (letters.length === 4) {
      return [letters];
    }
    const midpoint = Math.ceil(letters.length / 2);
    return [letters.slice(0, midpoint), letters.slice(midpoint)];
  };

  return (
    <View className="flex-1 bg-[#FDF6E5]">
      {/* 상단 로고 */}
      <View className="w-full h-[11%] items-center justify-end pb-1"></View>

      {/* Streak & Timer (예시용 정적) */}
      <View className="w-full h-[12%] justify-end">
        <Text className="text-center text-[34px] font-[Nunito] font-bold text-black">
          Streak: 50
        </Text>
        <Text className="text-center text-[20px] font-[Nunito] font-bold text-red-600 mt-[3%]">
          10
        </Text>
      </View>

      {/* 정답 영역 */}
      <View className="w-full h-[30%] justify-center items-center">
        {selectedIndexes.length === 0 ? (
          <Text className="text-[30px] font-[Nunito] text-gray-400 italic">
            What's the word?
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
              {Array.from({ length: wordLength }).map((_, idx) => (
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
      </View>

      {/* 글자 버튼 */}
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
                        : prev.length < wordLength
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

      {/* Clear 버튼 */}
      <View className="w-full h-[8%] justify-start items-center">
        <Text
          onPress={() => setSelectedIndexes([])}
          className="text-center text-[24px] text-underline font-[Nunito] font-medium text-gray-600"
        >
          clear
        </Text>
      </View>

      {/* 하단 Exit 버튼만 유지 */}
      <View className="w-full h-[13%] justify-center items-center">
        <TouchableOpacity
          className="w-[60%] bg-[#246965] rounded-xl h-[50px] items-center justify-center "
          onPress={() => router.back()}
        >
          <Text className="font-[nunito] text-[24px] text-white font-bold">
            Exit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
