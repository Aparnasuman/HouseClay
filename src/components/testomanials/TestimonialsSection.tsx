import { placeholderImageURL, testimonialImageURL } from "@/src/common/cdnURLs";
import ImageWithLoader from "@/src/components/ImageWithLoader";
import { Testimonial } from "@/src/data/TestimonialsData.json";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CarouselHorizontal from "./CarouselHorizontal";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonialData";

export default function TestimonialsSection() {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <ImageWithLoader
          src={testimonialImageURL}
          placeholderSrc={placeholderImageURL}
          width={320}
          height={64}
          borderRadius={12}
        />
      </View>

      <Text style={styles.heading}>
        Sign up and become part of a vibrant community of 5,000+ flatwappers.
      </Text>

      <Text style={styles.subHeading}>
        Our users’ success stories reflect trust, transparency, and value.
      </Text>

      <CarouselHorizontal
        data={testimonials}
        renderItem={({ item }: { item: Testimonial }) => (
          <TestimonialCard testimonial={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  subHeading: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
});
