import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

type StampsData = {
  [year: string]: {
    [month: string]: string; // img_url
  };
};

const Stamps = () => {
  const [stamps, setStamps] = useState<StampsData>({});

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
      <Text style={styles.title}>Your Stamps</Text>

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
});
