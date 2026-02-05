import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FeatureGrid from "./FeatureGrid";
import HomeSearchBar from "./HomeSearchBar";
import HomeTabs from "./HomeTabs";
import PromoBanner from "./PromoBanner";

export default function HomeMasthead() {
  return (
    <View style={styles.container}>
      <HomeTabs />
      <HomeSearchBar />

      {/* Tagline */}
      <View style={styles.tagline}>
        <Text style={styles.bold}>Stop Searching.</Text>
        <Text style={styles.red}>Start Connecting.</Text>
      </View>

      <FeatureGrid />
      <PromoBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 24,
  },
  tagline: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  bold: {
    fontSize: 20,
    fontWeight: "700",
  },
  red: {
    fontSize: 20,
    color: "#E53935",
    fontWeight: "600",
  },
});
