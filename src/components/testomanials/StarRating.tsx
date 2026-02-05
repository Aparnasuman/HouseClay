import { Star } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export default function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          color={i <= rating ? "#facc15" : "#d1d5db"}
          fill={i <= rating ? "#facc15" : "transparent"}
        />
      ))}
    </View>
  );
}
