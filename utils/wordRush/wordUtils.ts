// utils/wordRush/wordUtils.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generate } from "random-words";

export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const fetchWordList = async (): Promise<string[]> => {
  const stored = await AsyncStorage.getItem("wordRushLetterCount");
  const length = Number(stored);
  if (!isNaN(length)) {
    const randomWords = generate({
      exactly: 1000,
      minLength: length,
      maxLength: length,
      wordsPerString: 1,
    });
    return Array.isArray(randomWords) ? randomWords : [];
  }
  return [];
};
