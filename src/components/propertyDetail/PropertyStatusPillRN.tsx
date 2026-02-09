import { PropertyStatus } from "@/src/common/enums";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  status: PropertyStatus;
};

export function PropertyStatusPillRN({ status }: Props) {
  const STATUS_MAP: Record<
    PropertyStatus,
    { label: string; bg: string; text: string }
  > = {
    [PropertyStatus.PENDING]: {
      label: "Pending",
      bg: "#DBEAFE",
      text: "#1D4ED8",
    },
    [PropertyStatus.VERIFIED]: {
      label: "Verified",
      bg: "#DCFCE7",
      text: "#166534",
    },
    [PropertyStatus.REPORT]: {
      label: "Reported",
      bg: "#FEF3C7",
      text: "#92400E",
    },
    [PropertyStatus.INACTIVE]: {
      label: "Inactive",
      bg: "#FEE2E2",
      text: "#991B1B",
    },
  };

  const item = STATUS_MAP[status];

  return (
    <View style={[styles.chip, { backgroundColor: item.bg }]}>
      <Text style={{ color: item.text, fontWeight: "600" }}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
