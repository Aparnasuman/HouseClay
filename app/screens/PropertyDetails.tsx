import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useGetMyPropertyByIdQuery,
  useGetPublicPropertyByIdQuery,
} from "@/src/store/apiSlice";
import { RootState } from "@/src/store/store";
import { useSelector } from "react-redux";

import { PostedAndRentDetailsRN } from "@/src/components/propertyDetail/PostedAndRentDetailsRN";
import { PropertyStatusPillRN } from "@/src/components/propertyDetail/PropertyStatusPillRN";
import { UpgradePropertyBannerRN } from "@/src/components/propertyDetail/UpgradePropertyBannerRN";

import { PropertyCategory } from "@/src/common/enums";

/* ================= TYPES ================= */

type RootStackParamList = {
  PropertyDetails: { propertyID: string };
};

type PropertyDetailsRouteProp = RouteProp<
  RootStackParamList,
  "PropertyDetails"
>;

/* ================= SCREEN ================= */

export default function PropertyDetails() {
  const route = useRoute<PropertyDetailsRouteProp>();
  const propertyID = route.params?.propertyID;

  // ✅ check if user is logged in using authSlice
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  // ✅ RTK query: choose depending on login status
  const { data, isLoading, isFetching, error, refetch } = isLoggedIn
    ? useGetMyPropertyByIdQuery(propertyID!, { skip: !propertyID })
    : useGetPublicPropertyByIdQuery(propertyID!, { skip: !propertyID });

  const property = data as any;
  const propertyUpdates = isLoggedIn
    ? ((data as any)?.propertyUpdates ?? [])
    : [];
  const contactedUsers = isLoggedIn ? ((data as any)?.contactUsers ?? []) : [];

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Unable to fetch property details</Text>
        <Text onPress={refetch} style={{ marginTop: 12, color: "blue" }}>
          Retry
        </Text>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Property not found</Text>
      </SafeAreaView>
    );
  }

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safe}>
      {isFetching && !isLoading && (
        <ActivityIndicator style={styles.topSpinner} />
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{property.propertyName ?? "Property"}</Text>

        {property.propertyStatus && (
          <PropertyStatusPillRN status={property.propertyStatus} />
        )}

        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>
            {property.propertyCategory ?? PropertyCategory.NONE}
          </Text>

          <Text style={styles.label}>BHK</Text>
          <Text style={styles.value}>{property.bhkType ?? "-"}</Text>

          <Text style={styles.label}>Area</Text>
          <Text style={styles.value}>
            {property.locality ?? property.addressLine ?? "-"}
          </Text>
        </View>

        <PostedAndRentDetailsRN
          property={property}
          propertyUpdates={propertyUpdates}
        />

        {isLoggedIn && (
          <View style={styles.statsRow}>
            <Stat label="Contacts" value={contactedUsers.length} />
            <Stat label="Views" value={property.viewUserCount ?? 0} />
            <Stat label="Shortlists" value={property.shortlistUserCount ?? 0} />
          </View>
        )}

        {/* UPGRADE - optional */}
        <UpgradePropertyBannerRN onUpgrade={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STAT ================= */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { padding: 16, paddingBottom: 140 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topSpinner: { position: "absolute", top: 8, right: 8, zIndex: 10 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 12,
  },
  label: { fontSize: 12, color: "#6B7280", marginTop: 6 },
  value: { fontSize: 15, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  stat: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#6B7280" },
});
