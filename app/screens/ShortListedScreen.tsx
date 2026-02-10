import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { RootStackParamList } from "@/app/navigation/RootNavigator";
import {
    BadgeType,
    PropertyCategory,
    PropertyStatus,
} from "@/src/common/enums";
import { useShortlist } from "@/src/hooks/useShortlist";
import { RootState } from "@/src/store/store";

const Properties = React.lazy(() => import("./Properties"));

/* ✅ Proper navigation typing */
type NavProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShortlistsScreen"
>;

const ScreenLoader = () => (
  <View style={{ padding: 20 }}>
    <ActivityIndicator size="large" />
  </View>
);

const FILTERS = [
  { label: "All", value: PropertyCategory.NONE },
  { label: "Rent", value: PropertyCategory.RENT },
  { label: "Flatmate", value: PropertyCategory.FLATMATE },
];

export default function ShortlistScreen() {
  const navigation = useNavigation<NavProp>();
  const { fetchShortlistedProperties } = useShortlist();

  const shortlisted = useSelector(
    (s: RootState) => s.shortlist.shortlistedProperties,
  );

  const userLoading = useSelector((s: RootState) => s.user.userDetailLoading);

  const [selectedCategory, setSelectedCategory] = useState(
    PropertyCategory.NONE,
  );

  useEffect(() => {
    fetchShortlistedProperties();
  }, [fetchShortlistedProperties]);

  const filtered = useMemo(() => {
    return shortlisted.filter((p) => {
      if (
        selectedCategory !== PropertyCategory.NONE &&
        p.propertyCategory !== selectedCategory
      )
        return false;

      return p.propertyState === PropertyStatus.VERIFIED;
    });
  }, [shortlisted, selectedCategory]);

  if (userLoading) return <ScreenLoader />;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} />
        </Pressable>
        <Text style={styles.title}>Shortlisted Properties</Text>
      </View>

      <View style={styles.divider} />

      {/* FILTER TABS */}
      <View style={styles.segmentWrap}>
        {FILTERS.map((f) => {
          const active = selectedCategory === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setSelectedCategory(f.value)}
              style={[styles.segBtn, active && styles.segBtnActive]}
            >
              <Text style={[styles.segTxt, active && styles.segTxtActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.propertyID}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Suspense fallback={<ScreenLoader />}>
            <Properties
              property={item}
              badgeType={(item as any).badgeType as BadgeType}
              showCarouselDots={false}
              onPress={() =>
                navigation.navigate("PropertyDetails", {
                  property: item,
                })
              }
            />
          </Suspense>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No shortlisted properties
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    justifyContent: "center",
  },

  backBtn: {
    position: "absolute",
    left: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },

  segmentWrap: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    margin: 12,
    borderRadius: 14,
    padding: 4,
  },

  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },

  segBtnActive: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ef4444",
  },

  segTxt: { fontSize: 14 },
  segTxtActive: { color: "#ef4444", fontWeight: "600" },
});
