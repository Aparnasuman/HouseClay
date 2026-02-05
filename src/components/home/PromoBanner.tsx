import { bannerPeopleMobileImageURL } from "@/src/common/cdnURLs";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function PromoBanner() {
  return (
    <View style={styles.wrapper}>
      <Image
        source={{ uri: bannerPeopleMobileImageURL }}
        style={styles.bgImage}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Introducing connects</Text>
        <Text style={styles.sub}>The new way to find your house</Text>

        <Text style={styles.point}>• ZERO brokerage</Text>
        <Text style={styles.point}>• Direct Deals</Text>
      </View>

      <Pressable style={styles.cta}>
        <Text style={styles.ctaText}>Know More</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 16,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  title: { fontSize: 16, fontWeight: "700" },
  sub: { fontSize: 12, marginVertical: 6 },
  point: { fontSize: 13, marginTop: 4 },
  cta: {
    alignSelf: "flex-end",
    backgroundColor: "#E53935",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 16,
  },
  ctaText: { color: "#fff", fontWeight: "600" },
});
