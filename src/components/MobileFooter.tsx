import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FOOTER_ITEMS = [
  { label: "Explore", icon: "search-outline", route: "/explore" },
  { label: "Shortlists", icon: "heart-outline", route: "/shortlists" },
  { label: "Home", icon: "home-outline", route: "/" },
  { label: "Contacts", icon: "call-outline", route: "/contacts" },
  { label: "Profile", icon: "person-outline", route: "/profile" },
];

export default function MobileFooter() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.footer}>
        {FOOTER_ITEMS.map((item) => (
          <Pressable key={item.label} style={styles.item}>
            <Ionicons name={item.icon as any} size={24} color="#6a6464" />
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  item: {
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#6a6464",
  },
});
