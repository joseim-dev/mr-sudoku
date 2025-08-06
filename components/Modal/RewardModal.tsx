import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RewardModalProps {
  visible: boolean;
  exp: number;
  coins: number;
  onClose: () => void;
}

export default function RewardModal({
  visible,
  exp,
  coins,
  onClose,
}: RewardModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Mustache!</Text>
          <Text style={styles.modalReward}>+{exp} EXP</Text>
          <View style={styles.coinRewardContainer}>
            <Text style={styles.modalReward}>+{coins} </Text>
            <Image
              source={require("../../assets/images/mustache.png")}
              style={styles.miniIcon}
            />
          </View>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalContent: {
    width: 280,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
    color: "#265D5A",
    fontFamily: "Nunito-Bold", // Nunito 폰트 적용
  },
  modalReward: {
    fontSize: 18,
    marginVertical: 4,
    color: "#265D5A",
  },
  coinRewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  miniIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: "#265D5A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
