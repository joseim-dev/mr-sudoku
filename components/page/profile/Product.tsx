import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Product() {
  const handleRedeem = () => {
    console.log("Redeem pressed!");
    // 여기에 리딤 기능 로직 추가
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Product of the Month</Text>

      <View style={styles.giftBox} />

      <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
        <Text style={styles.redeemButtonText}>Redeem</Text>
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
