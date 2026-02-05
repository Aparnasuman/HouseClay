import { PropertyCategory } from "@/src/common/enums";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeatureGrid from "./FeatureGrid";
import HomeSearchBar from "./HomeSearchBar";
import HomeTabs from "./HomeTabs";
import PromoBanner from "./PromoBanner";

export default function HomeMasthead() {
  const [activeTab, setActiveTab] = useState<"rent" | "room">("rent");
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>(
    PropertyCategory.RENT,
  );

  useEffect(() => {
    setPropertyCategory(
      activeTab === "rent" ? PropertyCategory.RENT : PropertyCategory.FLATMATE,
    );
  }, [activeTab]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HomeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <HomeSearchBar />

      <View style={styles.tagline}>
        <Text style={styles.bold}>Stop Searching.</Text>
        <Text style={styles.red}>Start Connecting.</Text>
      </View>

      <FeatureGrid propertyCategory={propertyCategory} />

      <PromoBanner />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 24,
    backgroundColor: "#F5F5F5",
  },
  tagline: { flexDirection: "row", justifyContent: "center", gap: 6 },
  bold: { fontSize: 20, fontWeight: "700" },
  red: { fontSize: 20, color: "#E53935", fontWeight: "600" },
});
