type LetterStatus = "correct" | "present" | "absent";

export default function evaluateGuess(
  guess: string,
  answer: string
): LetterStatus[] {
  const result: LetterStatus[] = Array(5).fill("absent");
  const answerChars = answer.split("");
  const guessChars = guess.split("");

  // 1단계: 위치와 글자가 모두 같은 경우 처리
  guessChars.forEach((char, i) => {
    if (char === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = ""; // 중복 방지를 위해 제거
    }
  });

  // 2단계: 글자는 포함되나 위치가 다른 경우 처리
  guessChars.forEach((char, i) => {
    if (result[i] === "correct") return;
    const indexInAnswer = answerChars.indexOf(char);
    if (indexInAnswer !== -1) {
      result[i] = "present";
      answerChars[indexInAnswer] = ""; // 다시 중복 방지
    }
  });

  return result;
}
