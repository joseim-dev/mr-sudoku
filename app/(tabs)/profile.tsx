import PasswordModal from "@/components/Modal/PasswordModal";
import { fetchMonthlyProducts } from "@/utils/fetchMonthlyProducts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [userExp, setUserExp] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState([]);

  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMonthlyProducts(Platform.OS);
      if (data) setProducts(data);
    };
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadUserStats = async () => {
        const exp = await AsyncStorage.getItem("userExp");
        const coins = await AsyncStorage.getItem("userCoins");
        setUserExp(parseInt(exp || "0", 10));
        setUserCoins(parseInt(coins || "0", 10));
      };
      loadUserStats();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-mainWhite dark:bg-mainBlack">
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: "center" }}>
        {/* Title Image */}
        <TouchableOpacity
          onLongPress={() => setModalVisible(true)}
          activeOpacity={0.99}
        >
          <Image
            source={
              colorScheme === "dark"
                ? require("@/assets/images/mustache-white.png")
                : require("@/assets/images/mustache.png")
            }
            className="w-[50px] h-[60px] mb-6"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* EXP Card */}
        <View className="bg-white dark:bg-subDarkGreen rounded-2xl w-full h-[70px] mb-4 flex-row items-center justify-between px-5 shadow-md">
          <Text className="text-lg font-bold text-gray-700 dark:text-mainWhite font-nunito">
            Experience
          </Text>
          <Text className="text-xl font-bold text-mainGreen dark:text-subLightGreen">
            {userExp} EXP
          </Text>
        </View>

        {/* Coins Card */}
        <View className="bg-white dark:bg-subDarkGreen rounded-2xl w-full h-[70px] mb-4 flex-row items-center justify-between px-5 shadow-md">
          <Text className="text-lg font-bold text-gray-700 dark:text-mainWhite font-nunito">
            Mustache
          </Text>
          <View className="flex-row items-center">
            <Image
              source={require("../../assets/images/mustache.png")}
              className="w-6 h-6 mr-2"
              resizeMode="contain"
            />
            <Text className="text-xl font-bold text-mainGreen dark:text-subLightGreen">
              {userCoins}
            </Text>
          </View>
        </View>

        {/* 다크모드 토글 버튼 */}
        <View className="w-full mb-4 flex-row justify-between items-center mt-6">
          <Text className="font-[Nunito] text-mainBlack text-xl font-bold dark:text-white">
            Dark Mode
          </Text>
          <TouchableOpacity
            onPress={toggleColorScheme}
            className="px-4 py-2 rounded-full bg-subPink dark:bg-subLightGreen"
          >
            <Text className="text-white font-semibold">
              {colorScheme === "dark" ? "On" : "Off"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product & Stamp Button */}
        {/* <Product />
        <TouchableOpacity
          className="mt-5 w-[95%] bg-white dark:bg-subDarkGreen py-3 px-6 rounded-full border-2 border-subLightGreen dark:border-subLightGreen items-center "
          onPress={() => router.push("/stamps")}
          activeOpacity={0.85}
        >
          <Text className="text-base font-bold text-mainGreen dark:text-subLightGreen">
            See my stamps
          </Text>
        </TouchableOpacity> */}

        {/* Password Modal */}
        <PasswordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
        <View className="w-full h-[50px]" />
      </ScrollView>
    </SafeAreaView>
  );
}
