// components/RewardModal.tsx

import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
          <Text style={styles.modalTitle}>🎉 Mr.Sudoku!</Text>
          <Text style={styles.modalReward}>+{exp} EXP</Text>
          <Text style={styles.modalReward}>+{coins} Mustaches</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Home</Text>
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalReward: {
    fontSize: 18,
    marginVertical: 4,
    color: "#265D5A",
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
