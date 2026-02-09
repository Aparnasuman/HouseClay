import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function Loading() {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <PulseBox style={{ width: 220, height: 26, borderRadius: 6 }} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PulseBox style={{ width: 22, height: 22, borderRadius: 4 }} />
          <PulseBox style={{ width: 140, height: 22, borderRadius: 6 }} />
        </View>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        {[1, 2, 3].map((i) => (
          <PulseBox key={i} style={styles.filterBtn} />
        ))}
      </View>

      {/* Card grid */}
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </View>
    </View>
  );
}

function CardSkeleton() {
  return (
    <View style={styles.card}>
      <PulseBox style={styles.image} />

      <View style={styles.row}>
        <PulseBox style={{ width: "50%", height: 14 }} />
        <PulseBox style={{ width: "30%", height: 14 }} />
      </View>

      <View style={styles.row}>
        <PulseBox style={{ width: "60%", height: 14 }} />
        <PulseBox style={{ width: "25%", height: 18 }} />
      </View>

      <PulseBox style={{ width: "45%", height: 14 }} />
      <PulseBox style={{ width: "100%", height: 14 }} />
    </View>
  );
}

function PulseBox({ style }: { style: any }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return <Animated.View style={[styles.pulse, style, { opacity }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  filterRow: {
    flexDirection: "row",
    gap: 12,
  },

  filterBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  image: {
    height: 160,
    borderRadius: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  pulse: {
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
  },
});
