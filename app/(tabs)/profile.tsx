import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [userExp, setUserExp] = useState(0);
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    const loadUserStats = async () => {
      const exp = await AsyncStorage.getItem("userExp");
      const coins = await AsyncStorage.getItem("userCoins");
      setUserExp(parseInt(exp || "0", 10));
      setUserCoins(parseInt(coins || "0", 10));
    };
    loadUserStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {/* 🔄 타이틀 이미지로 대체 */}
        <Image
          source={require("../../assets/images/mr_sudoku.png")}
          style={styles.titleImage}
          resizeMode="contain"
        />

        <View
          style={[
            styles.card,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={styles.cardTitle}>Experience</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.cardValue}>{userExp} EXP</Text>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={styles.cardTitle}>Mustache</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/images/mustache.png")}
              style={[styles.mustacheIcon, { marginRight: 8 }]}
              resizeMode="contain"
            />
            <Text style={styles.cardValue}>{userCoins}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Product of the Month</Text>

        <View style={styles.giftBox} />

        <TouchableOpacity
          style={styles.redeemButton} // 기존 Start New Game 스타일과 동일하게 적용
          onPress={() => {
            // 리딤 기능 실행 로직
            console.log("Redeem pressed!");
          }}
        >
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF6E5" },
  inner: { padding: 24, alignItems: "center" },
  titleImage: {
    width: 240,
    height: 80,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 70,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444",
    fontFamily: "Nunito",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#265D5A",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginVertical: 16,
    alignSelf: "flex-start",
    fontFamily: "Nunito",
  },
  giftBox: {
    width: "100%",
    aspectRatio: 12 / 8,
    borderWidth: 1.5,
    borderColor: "#aaa",
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  redeemButton: {
    width: "95%",
    backgroundColor: "#265D5A",
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    marginTop: 12,
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Nunito",
  },
  mustacheIcon: {
    width: 24,
    height: 24,
  },
});
