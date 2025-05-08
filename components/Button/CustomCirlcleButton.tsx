import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface CustomCircleButtonProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const CustomCircleButton: React.FC<CustomCircleButtonProps> = ({
  onPress,
  iconName,
  color = "#F28B82",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[50px] h-[50px] rounded-full  border-[1px] bg-[#F28B82] justify-center items-center shadow-sm"
    >
      <Ionicons name={iconName} size={30} color={color} />
    </TouchableOpacity>
  );
};

export default CustomCircleButton;
