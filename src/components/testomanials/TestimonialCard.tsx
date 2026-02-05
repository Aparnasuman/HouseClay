import { peopleImages } from "@/src/assets/image";
import { Quote } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { CARD_WIDTH } from "./CarouselHorizontal";
import StarRating from "./StarRating";

export default function TestimonialCard({ testimonial }: any) {
  const avatarSource = peopleImages[testimonial.avatar];

  return (
    <View style={styles.card}>
      <Quote
        size={24}
        color="#E53935"
        style={{ transform: [{ rotate: "180deg" }] }}
      />

      <Text style={styles.content}>{testimonial.content}</Text>

      <View style={styles.footer}>
        <View style={styles.userRow}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : (
            <View style={styles.fallback}>
              <Text style={styles.initial}>{testimonial.initial}</Text>
            </View>
          )}
          <Text style={styles.name}>{testimonial.name}</Text>
        </View>

        <StarRating rating={testimonial.rating} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
  },
  content: {
    marginVertical: 12,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: "600",
    color: "#111827",
  },
  fallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontWeight: "600",
    color: "#374151",
  },
});
