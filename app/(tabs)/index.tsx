import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useCallback, useEffect, useState } from "react";

import {
  getTrackingPermissionsAsync,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  useEffect(() => {
    const init = async () => {
      const { status } = await getTrackingPermissionsAsync();
      if (status === PermissionStatus.UNDETERMINED) {
        await requestTrackingPermissionsAsync();
      }
    };

    init();
  }, []);
  const posthog = usePostHog();

  const screenHeight = Dimensions.get("window").height;
  const isSmallDevice = screenHeight < 700; // 기준은 필요에 따라 조절
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [savedTime, setSavedTime] = useState<number | null>(null);
  const [userExp, setUserExp] = useState(0);

  const levelRequirements: Record<string, number> = {
    easy: 0,
    normal: 0,
    medium: 30,
    hard: 100,
    extreme: 220,
    master: 400,
  };

  const difficulties = [
    { key: "easy", label: "EASY", base: "easy" },
    { key: "normal", label: "NORMAL", base: "easy" },
    { key: "medium", label: "MEDIUM", base: "medium" },
    { key: "hard", label: "HARD", base: "medium" },
    { key: "extreme", label: "EXTREME", base: "hard" },
    { key: "master", label: "MASTER", base: "hard" },
  ];

  useFocusEffect(
    useCallback(() => {
      const checkSavedGame = async () => {
        const saved = await AsyncStorage.getItem("sudokuSavedGame");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSavedTime(parsed.time);
        } else {
          setSavedTime(null);
        }

        const exp = await AsyncStorage.getItem("userExp");
        setUserExp(parseInt(exp || "0", 10));
      };

      checkSavedGame();
    }, [])
  );

  const handleStartGame = () => {
    setModalVisible(true);
  };

  const handleContinueGame = () => {
    router.push("/game");
  };

  const handleSelectDifficulty = async (key: string, base: string) => {
    await AsyncStorage.multiRemove([
      "sudokuGrid",
      "sudokuInitialGrid",
      "sudokuSolutionGrid",
      "sudokuTime",
      "sudokuDifficulty",
      "sudokuDifficultyLabel",
      "sudokuSavedGame",
    ]);
    await AsyncStorage.setItem("sudokuDifficulty", base);
    await AsyncStorage.setItem("sudokuDifficultyLabel", key);
    posthog.capture("Start New Game");
    setModalVisible(false);

    router.push("/game");
  };

  const cardImages = [
    require("../../assets/images/home-card-1.png"),
    require("../../assets/images/home-card-2.png"),
    require("../../assets/images/home-card-3.png"),
    // require("../../assets/images/home-card-4.png"),
  ];

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <View className="flex-1 bg-[#FDF6E5] justify-start items-center ">
      <View className="h-[11%] w-full flex justify-end items-center pb-4">
        {/* <Image
          source={require("../assets/images/icon.png")}
          style={{ width: 180, height: 40, resizeMode: "contain" }}
        /> */}
        <ImageBackground
          source={require("@/assets/images/mustache.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
      </View>
      <View className="w-full h-[29%] pl-4">
        {isSmallDevice ? (
          <View className="w-full h-full justify-end items-center">
            <Image
              source={require("../../assets/images/mr_sudoku.png")}
              className="w-[85%] h-[100px]"
              resizeMode="contain"
            />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {cardImages.map((img, index) => (
              <View
                key={index}
                className="w-[210px] h-full rounded-xl mr-4 overflow-hidden"
              >
                <Image
                  source={img}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {isSmallDevice ? (
        <View className="w-full h-[30%] flex items-center justify-center "></View>
      ) : (
        <View className="w-full h-[30%] flex items-center justify-center ">
          <Image
            source={require("../../assets/images/mr_sudoku.png")}
            className="w-[85%] h-[120px] "
            resizeMode="contain"
          />
        </View>
      )}

      <View className="w-full h-[22%] flex justify-end items-center pb-[40px] ">
        {savedTime !== null && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueGame}
            activeOpacity={0.9}
          >
            <Text style={styles.continueText}>
              Continue Game ({formatTime(savedTime)})
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="w-[85%] h-[50px] bg-[#265D5A] rounded-full items-center justify-center shadow-md"
          onPress={handleStartGame}
          activeOpacity={0.9}
        >
          <Text className="text-white text-[18px] font-bold font-[Nunito]">
            Start New Game
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-full h-[8%] " />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Difficulty</Text>

            {difficulties.map((level) => {
              const requiredExp = levelRequirements[level.key];
              const locked = userExp < requiredExp;

              return (
                <TouchableOpacity
                  key={level.key}
                  style={[
                    styles.difficultyButton,
                    locked && styles.disabledButton,
                  ]}
                  disabled={locked}
                  onPress={() => handleSelectDifficulty(level.key, level.base)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      locked && styles.disabledText,
                    ]}
                  >
                    {level.label}
                    {locked ? ` (${requiredExp} EXP)` : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Nunito",
  },
  difficultyButton: {
    backgroundColor: "#265D5A",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 35,
    marginVertical: 8,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치
    shadowOpacity: 0.2, // 그림자 투명도
    shadowRadius: 4, // 그림자 블러 정도
    elevation: 4, // Android용 그림자
  },

  difficultyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Nunito",
  },
  disabledButton: {
    backgroundColor: "#bbb",
  },
  disabledText: {
    color: "#eee",
  },
  cancelText: {
    marginTop: 16,
    color: "#777",
    fontSize: 14,
  },
  continueButton: {
    width: "85%",
    height: 50,
    backgroundColor: "#4E4E4E",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Nunito",
  },
});
