import { PropertyCategory } from "@/src/common/enums";
import { formatINRCurrency } from "@/src/common/utils";
import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function PostedAndRentDetailsRN({ property, propertyUpdates }: any) {
  if (!property) return null;

  const last = propertyUpdates?.[propertyUpdates.length - 1];

  const amount =
    property.propertyCategory === PropertyCategory.RESALE
      ? property.price
      : property.rent;

  return (
    <View style={styles.grid}>
      <Card
        label="Posted On"
        value={
          last?.updateTime
            ? format(new Date(last.updateTime), "MMM d, yyyy")
            : "-"
        }
      />

      <Card
        label={
          property.propertyCategory === PropertyCategory.RESALE
            ? "Price"
            : "Rent"
        }
        value={amount ? formatINRCurrency(amount) : "-"}
      />
    </View>
  );
}

function Card({ label, value }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 12,
    margin: 16,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 12,
  },
  label: { textAlign: "center", color: "#666", fontSize: 12 },
  value: { textAlign: "center", fontSize: 16, fontWeight: "700" },
});
