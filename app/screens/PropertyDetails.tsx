import { RootStackParamList } from "@/app/navigation/RootNavigator";
import { processPropertyImages } from "@/src/common/utils";
import ImageCarousel from "@/src/hoc/ImageCarousel";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Heart, Share2 } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RouteType = RouteProp<RootStackParamList, "PropertyDetails">;
const { width } = Dimensions.get("window");

export default function PropertyDetails() {
  const route = useRoute<RouteType>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const property = route.params.property;

  if (!property) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No property data</Text>
      </SafeAreaView>
    );
  }
  const propertyImages = useMemo(
    () => processPropertyImages(property.images),
    [property.images],
  );

  const price = property.price ?? property.rent ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ---------- IMAGE CAROUSEL ---------- */}

      <View>
        <ImageCarousel images={propertyImages} height={200} />

        {/* overlay icons */}
        <View style={styles.topBar}>
          <IconBtn onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} />
          </IconBtn>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <IconBtn>
              <Share2 size={18} />
            </IconBtn>
            <IconBtn>
              <Heart size={18} />
            </IconBtn>
          </View>
        </View>
      </View>

      {/* ---------- CONTENT ---------- */}

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title */}
        <Text style={styles.title}>{property.locationOrSocietyName}</Text>

        {/* Location */}
        <Text style={styles.location}>{property.city}</Text>

        {/* ---------- QUICK FEATURES CARD ---------- */}

        <View style={styles.card}>
          <Feature label="Category" value={property.propertyCategory} />
          <Feature label="Type" value={property.propertyType} />
          <Feature label="BHK" value={property.bhkType} />
          <Feature label="Bathrooms" value={property.bathrooms} />
          <Feature label="Furnishing" value={property.furnishing} />
          <Feature label="Area" value={`${property.builtUpArea} sq.ft`} />
        </View>

        {/* ---------- DESCRIPTION ---------- */}

        <>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}> {property.landmark || "No landmark"}</Text>
        </>

        {/* ---------- OTHER DETAILS GRID ---------- */}

        <Text style={styles.sectionTitle}>Other Details</Text>

        <View style={styles.grid}>
          <GridItem label="City" value={property.city} />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ---------- BOTTOM BAR ---------- */}

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Rent</Text>
          <Text style={styles.price}>₹ {price}</Text>
        </View>

        <TouchableOpacity style={styles.cta}>
          <Text style={styles.ctaText}>Contact Owner</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Feature({ label, value }: any) {
  if (!value) return null;
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureLabel}>{label}</Text>
      <Text style={styles.featureValue}>{value}</Text>
    </View>
  );
}

function GridItem({ label, value }: any) {
  if (!value) return null;
  return (
    <View style={styles.gridItem}>
      <Text style={styles.gridLabel}>{label}</Text>
      <Text style={styles.gridValue}>{value}</Text>
    </View>
  );
}

function IconBtn({ children, onPress }: any) {
  return (
    <TouchableOpacity style={styles.iconBtn} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { padding: 16 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: {
    width,
    height: 260,
  },

  topBar: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  iconBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },

  title: { fontSize: 20, fontWeight: "700", marginTop: 12 },
  location: { color: "#6B7280", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },

  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  featureLabel: { color: "#6B7280" },
  featureValue: { fontWeight: "600" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },

  desc: {
    lineHeight: 20,
    color: "#374151",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  gridItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  gridLabel: { color: "#6B7280", fontSize: 12 },
  gridValue: { fontWeight: "600", marginTop: 4 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 14,
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceLabel: { fontSize: 12, color: "#6B7280" },
  price: { fontSize: 18, fontWeight: "700" },

  cta: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  ctaText: { color: "#fff", fontWeight: "700" },
});
