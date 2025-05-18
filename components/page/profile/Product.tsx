import { fetchMonthlyProducts } from "@/utils/fetchMonthlyProducts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Product() {
  const [product, setProduct] = useState<any>(null);
  const [coins, setCoins] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coinStr, data] = await Promise.all([
          AsyncStorage.getItem("userCoins"),
          fetchMonthlyProducts(Platform.OS),
        ]);

        const coinValue = parseInt(coinStr || "0", 10);
        setCoins(coinValue);

        if (data && data.length > 0) {
          setProduct(data[0]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRedeem = async () => {
    if (!product?.price || !product?.img_url) {
      Alert.alert("Error", "Product information is invalid.");
      return;
    }

    if (coins < product.price) {
      Alert.alert(
        "Insufficient Mustaches",
        "You don't have enough Mustaches to redeem this product."
      );
      return;
    }

    const updatedCoins = coins - product.price;

    try {
      await AsyncStorage.setItem("userCoins", updatedCoins.toString());
      setCoins(updatedCoins);

      const now = new Date();
      const year = now.getFullYear().toString();
      const month = now
        .toLocaleString("en-US", { month: "long" })
        .toLowerCase();

      const stampStr = await AsyncStorage.getItem("stamps");
      const stamps = stampStr ? JSON.parse(stampStr) : {};

      if (stamps[year]?.[month]) {
        Alert.alert(
          "Already Redeemed",
          "You already have a stamp for this month."
        );
        return;
      }

      if (!stamps[year]) {
        stamps[year] = {};
      }

      stamps[year][month] = product.img_url;

      await AsyncStorage.setItem("stamps", JSON.stringify(stamps));

      Alert.alert("Stamp Purchased");
    } catch (err) {
      console.error("Error saving stamp:", err);
      Alert.alert(
        "Error",
        "Something went wrong during the purchase. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#265D5A" />
      </View>
    );
  }

  if (!product || product.live === false) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>Monthly Stamp</Text>

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
    fontSize: 24,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
});
