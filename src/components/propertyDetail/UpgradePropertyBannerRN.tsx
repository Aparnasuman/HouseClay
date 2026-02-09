import { BadgeCheck, TrendingUp, Users } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function UpgradePropertyBannerRN({
  onUpgrade,
}: {
  onUpgrade: () => void;
}) {
  return (
    <View style={styles.card}>
      <Image style={styles.image} />

      <Text style={styles.title}>
        Looking for verified tenants paying higher rental?
      </Text>

      <Text style={styles.subtitle}>
        Upgrade to Discover and let us handle your property with care.
      </Text>

      <View style={styles.points}>
        <Row
          icon={<BadgeCheck size={18} color="green" />}
          text="Verified Tenants"
        />
        <Row
          icon={<TrendingUp size={18} color="blue" />}
          text="Higher Rental Income"
        />
        <Row
          icon={<Users size={18} color="#EAB308" />}
          text="Hassle-Free Management"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={onUpgrade}>
        <Text style={styles.buttonText}>Upgrade Now</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ icon, text }: any) {
  return (
    <View style={styles.row}>
      {icon}
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    margin: 16,
  },
  image: { width: 90, height: 90, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { color: "#666", marginVertical: 6 },
  points: { gap: 8, marginVertical: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  button: {
    borderWidth: 1,
    borderColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#ef4444", fontWeight: "600" },
});
