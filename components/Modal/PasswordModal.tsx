import { saveAdsRemoved } from "@/utils/SecureStore/adsRemovedStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
interface PasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PasswordModal({
  visible,
  onClose,
}: PasswordModalProps) {
  const [inputPw, setInputPw] = useState("");
  const pw = "22201472";

  const handleCheckPassword = async (input: string) => {
    if (input === pw) {
      await AsyncStorage.setItem("userExp", "10000");
      await AsyncStorage.setItem("userCoins", "10000");

      // ✅ 광고 제거 상태 저장
      await saveAdsRemoved();

      Alert.alert("pw correct");
    } else {
      console.log("pw incorrect");
    }
    onClose();
  };

  const handleSubmit = () => {
    handleCheckPassword(inputPw);
    setInputPw("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>UserName</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={inputPw}
            onChangeText={setInputPw}
          />
          <Button title="Confirm" onPress={handleSubmit} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
});
