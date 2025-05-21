import { useRouter } from "expo-router";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type GameCardProps = {
  title: string;
  image: ImageSourcePropType;
  cardColor?: string; // 카드 배경색
  borderColor?: string; // 카드 테두리색
  buttonColor?: string; // 버튼 배경색
  gameName: string; // 버튼 클릭 시 이동할 경로
};

export default function GameCard({
  title,
  image,
  cardColor = "#1B4529",
  borderColor = "#357A4A",
  buttonColor = "#5FB085",
  gameName,
}: GameCardProps) {
  const router = useRouter();

  const onPress = () => {
    router.push({
      pathname: "/gameLobby/[gameName]",
      params: { gameName },
    });

    requestTrackingPermissionsAsync();
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
          <ImageBackground
            source={image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          activeOpacity={0.85}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    borderWidth: 5,
    width: "47%",
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
