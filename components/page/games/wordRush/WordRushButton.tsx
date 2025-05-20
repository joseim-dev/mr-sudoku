import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type LetterButtonProps = {
  letter: string;
  selected: boolean;
  order?: number;
  onPress: () => void;
};

export default function WordRushButton({
  letter,
  selected,
  order,
  onPress,
}: LetterButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 70,
        height: 70,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: "#2B6D69",
        backgroundColor: selected ? "#2B6D69" : "transparent",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginHorizontal: 5,
      }}
    >
      {/* 선택 순서 표시 */}
      {selected && order !== undefined && (
        <View
          style={{
            position: "absolute",
            top: 3,
            right: 3,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {order}
          </Text>
        </View>
      )}

      {/* 글자 표시 */}
      <Text
        style={{
          fontSize: 36,
          fontFamily: "Nunito",
          fontWeight: "bold",
          color: selected ? "#fff" : "#2B6D69", // 선택 전은 흰색 유지
        }}
      >
        {letter.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}
