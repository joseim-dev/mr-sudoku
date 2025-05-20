// components/CustomButton.tsx
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  label: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      className="w-full h-[50px] rounded-full bg-[#265D5A] justify-center items-center shadow-md"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-white text-[18px] font-bold font-nunito">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
