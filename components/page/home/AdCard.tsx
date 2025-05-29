import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type GameCardProps = {
  title: string;
  cardColor?: string; // 카드 배경색
  borderColor?: string; // 카드 테두리색
  buttonColor?: string; // 버튼 배경색
  gameName: string; // 버튼 클릭 시 이동할 경로
};

export default function AdCard({
  title,
  cardColor = "#1B4529",
  borderColor = "#357A4A",
  buttonColor = "#5FB085",
  gameName,
}: GameCardProps) {
  const onPress = async () => {
    const url = "https://www.instagram.com/itsmrsudoku/";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Don't know how to open URI: " + url);
    }
  };
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardColor,
          borderColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Ionicons name="logo-instagram" size={76} color="#E5E5E5" />
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          activeOpacity={0.85}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Visit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    borderWidth: 5,
    width: "48%",
    aspectRatio: 1,
    alignItems: "center",
  },
  titleContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
    top: 8,
  },
  titleText: {
    fontSize: 24,
    fontFamily: "nunito",
    fontWeight: "900",
    color: "#FDF6E5",
  },
  imageContainer: {
    width: "100%",
    height: "46%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "2%",
  },
  imageWrapper: {
    height: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonWrapper: {
    width: "100%",
    height: "22%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: "2%",
  },
  button: {
    width: "65%",
    height: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "nunito",
    fontWeight: "800",
    color: "#FDF6E5",
  },
});
