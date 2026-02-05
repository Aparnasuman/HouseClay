import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeTabs() {
  const [active, setActive] = useState<"rent" | "room">("rent");

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.tab, active === "rent" && styles.active]}
        onPress={() => setActive("rent")}
      >
        <Text style={[styles.text, active === "rent" && styles.activeText]}>
          Flats for rent
        </Text>
      </Pressable>

      <Pressable
        style={[styles.tab, active === "room" && styles.active]}
        onPress={() => setActive("room")}
      >
        <Text style={[styles.text, active === "room" && styles.activeText]}>
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
