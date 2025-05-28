import { Dimensions, Text, TouchableOpacity, View } from "react-native";

type NumberPadProps = {
  onSelectNumber: (num: number | null) => void;
  completedNumbers?: number[]; // 완성된 숫자들 배열 추가
};

export default function NumberPad({
  onSelectNumber,
  completedNumbers = [],
}: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const screenWidth = Dimensions.get("window").width;
  const buttonMargin = 4;
  const totalMargin = buttonMargin * 2 * 9;
  const buttonWidth = (screenWidth - totalMargin - 32) / 9;

  return (
    <View className="w-full h-fit">
      <View className="flex-row justify-center">
        {numbers.map((num) => {
          const isCompleted = completedNumbers.includes(num);

          return (
            <TouchableOpacity
              key={num}
              className="m-1.5 justify-center items-center rounded"
              style={{
                width: buttonWidth,
                height: 40,
                opacity: isCompleted ? 0.3 : 1, // 완성된 숫자는 opacity 적용
              }}
              onPress={() => onSelectNumber(num)}
              // 완성된 숫자는 터치 비활성화 (선택사항)
              disabled={isCompleted}
            >
              <Text
                className="text-[36px] text-[#265D5A] font-medium"
                style={{
                  opacity: isCompleted ? 0.5 : 1, // 텍스트에도 추가 opacity 적용
                }}
              >
                {num}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
