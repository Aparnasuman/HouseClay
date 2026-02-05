import MobileFooter from "@/src/components/MobileFooter";
import HomeMasthead from "@/src/components/home/HomeMasthead";
import TestimonialsSection from "@/src/components/testomanials/TestimonialsSection";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false} // ✅ stop iOS bounce
          overScrollMode="never" // ✅ stop Android overscroll
          contentContainerStyle={styles.scroll}
        >
          <HomeMasthead />
          <TestimonialsSection />
        </ScrollView>

        <MobileFooter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  scroll: {
    paddingBottom: 24,
    flexGrow: 1, // ✅ prevents fake empty scroll space
  },
});
