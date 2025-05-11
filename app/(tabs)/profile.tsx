import PasswordModal from "@/components/Modal/PasswordModal";
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
import { TestIds, useInterstitialAd } from "react-native-google-mobile-ads";

export default function SettingsScreen() {
  // const interstitialAdId = __DEV__
  //   ? TestIds.INTERSTITIAL
  //   : "ca-app-pub-7270360511167481/3612345866";
  // // : Platform.OS === "ios"
  // // ? "ca-app-pub-7270360511167481/3612345866"
  // // : "ca-app-pub-7270360511167481/4243789307";

  const { load, show, isLoaded } = useInterstitialAd(TestIds.INTERSTITIAL);

  const [userExp, setUserExp] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadUserStats = async () => {
      const exp = await AsyncStorage.getItem("userExp");
      const coins = await AsyncStorage.getItem("userCoins");
      setUserExp(parseInt(exp || "0", 10));
      setUserCoins(parseInt(coins || "0", 10));
    };

    loadUserStats();
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {/* 🔄 타이틀 이미지로 대체 */}
        <TouchableOpacity
          onLongPress={() => setModalVisible(true)}
          activeOpacity={0.99}
        >
          <Image
            source={require("../../assets/images/mr_sudoku.png")}
            style={styles.titleImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

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
        <TouchableOpacity
          disabled={!isLoaded}
          style={{
            marginTop: 20,
            padding: 12,
            backgroundColor: isLoaded ? "#265D5A" : "#A9A9A9",
            borderRadius: 8,
          }}
          onPress={() => {
            if (isLoaded) {
              show();
            }
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              opacity: isLoaded ? 1 : 0.6,
            }}
          >
            {isLoaded ? "전면 광고 보기" : "광고 로딩 중..."}
          </Text>
        </TouchableOpacity>

        {/* <Product /> */}
        {/* ✅ 모달 컴포넌트 사용 */}
        <PasswordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />

        <View className="w-full h-[50px]"></View>
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

  mustacheIcon: {
    width: 24,
    height: 24,
  },
});
