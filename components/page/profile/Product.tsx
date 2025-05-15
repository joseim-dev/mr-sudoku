import { fetchMonthlyProducts } from "@/utils/fetchMonthlyProducts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Product() {
  const [product, setProduct] = useState<any>(null);
  const [coins, setCoins] = useState<number>(0);
  const router = useRouter();
  useEffect(() => {
    const loadData = async () => {
      const [coinStr, data] = await Promise.all([
        AsyncStorage.getItem("userCoins"),
        fetchMonthlyProducts(Platform.OS),
      ]);

      const coinValue = parseInt(coinStr || "0", 10);
      setCoins(coinValue);

      if (data && data.length > 0) {
        setProduct(data[0]);
      }
    };
    loadData();
  }, []);

  const handleRedeem = async () => {
    if (!product?.price) {
      Alert.alert("Error", "상품 가격이 유효하지 않습니다.");
      return;
    }

    if (coins < product.price) {
      Alert.alert("Not enough Mustaches");
    } else {
      const updatedCoins = coins - product.price;

      try {
        await AsyncStorage.setItem("userCoins", updatedCoins.toString());
        setCoins(updatedCoins);

        Alert.alert(
          "Purchased!",
          "The link/promo code for the product is provided once.",
          [
            {
              text: "Go see product",
              onPress: () => {
                Linking.openURL(product.link);
                router.replace("/(tabs)");
              },
            },
          ]
        );
      } catch (err) {
        console.error("코인 차감 오류:", err);
        Alert.alert("Error", "Please try again");
      }
    }
  };

  if (!product || product.live === false) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>Product of the Month</Text>

      <View style={styles.giftBox}>
        {product.img_url ? (
          <Image
            source={{ uri: product.img_url }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <ActivityIndicator size="small" color="#265D5A" />
        )}
      </View>

      <TouchableOpacity
        style={styles.redeemButton}
        onPress={handleRedeem}
        activeOpacity={0.85}
      >
        <Text style={styles.redeemButtonText}>
          Redeem ({product.price} Mustache)
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
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
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
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
});
