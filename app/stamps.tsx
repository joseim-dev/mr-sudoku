import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type StampsData = {
  [year: string]: {
    [month: string]: string; // img_url
  };
};

const Stamps = () => {
  const [stamps, setStamps] = useState<StampsData>({});
  const router = useRouter();

  useEffect(() => {
    const loadStamps = async () => {
      const stored = await AsyncStorage.getItem("stamps");
      if (stored) {
        const parsed: StampsData = JSON.parse(stored);
        setStamps(parsed);
      }
    };
    loadStamps();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 제목을 쓰고 싶다면 아래 주석 해제 */}
      {/* <Text style={styles.title}>Your Stamps</Text> */}

      {Object.keys(stamps)
        .sort()
        .map((year) => (
          <View key={year} style={styles.yearSection}>
            <Text style={styles.yearText}>{year}</Text>

            {Object.keys(stamps[year])
              .sort()
              .map((month) => (
                <View key={month} style={styles.stampCard}>
                  <Text style={styles.monthText}>{month.toUpperCase()}</Text>
                  <Image
                    source={{ uri: stamps[year][month] }}
                    style={styles.stampImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
          </View>
        ))}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.85}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Stamps;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#FDF6E5",
    minHeight: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 28,
    fontFamily: "Nunito",
    color: "#2F2F2F",
    textAlign: "center",
  },
  yearSection: {
    marginBottom: 32,
  },
  yearText: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#3D3D3D",
    borderLeftWidth: 4,
    borderLeftColor: "#265D5A",
    paddingLeft: 10,
  },
  stampCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#265D5A",
  },
  stampImage: {
    width: "100%",
    aspectRatio: 12 / 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  backButton: {
    marginTop: 20,
    marginBottom: 60,
    backgroundColor: "#265D5A",
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Nunito",
  },
});
