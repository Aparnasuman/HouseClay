import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const items = [
  { label: "Find Flatmates", icon: "people" },
  { label: "Find Rooms", icon: "bed" },
  { label: "Weekly Standouts", icon: "diamond" },
  { label: "List Your Property", icon: "home", free: true },
];

export default function FeatureGrid() {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <Pressable style={styles.card}>
            {item.free && <Text style={styles.free}>FREE</Text>}
            <Ionicons name={item.icon as any} size={26} color="#E53935" />
          </Pressable>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    width: "23%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    position: "relative",
  },
  free: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#E53935",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
  },
});
