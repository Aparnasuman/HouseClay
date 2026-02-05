import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface HomeTabsProps {
  activeTab: "rent" | "room";
  setActiveTab: (tab: "rent" | "room") => void;
}

export default function HomeTabs({ activeTab, setActiveTab }: HomeTabsProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.tab, activeTab === "rent" && styles.active]}
        onPress={() => setActiveTab("rent")}
      >
        <Text style={[styles.text, activeTab === "rent" && styles.activeText]}>
          Flats for rent
        </Text>
      </Pressable>

      <Pressable
        style={[styles.tab, activeTab === "room" && styles.active]}
        onPress={() => setActiveTab("room")}
      >
        <Text style={[styles.text, activeTab === "room" && styles.activeText]}>
          Find rooms
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  active: {
    borderBottomWidth: 2,
    borderColor: "#E53935",
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  activeText: {
    color: "#E53935",
    fontWeight: "600",
  },
});
