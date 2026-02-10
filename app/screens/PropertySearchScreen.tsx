import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "@/app/navigation/RootNavigator";
import UnifiedSearchAutocomplete from "@/src/base_component/PlacesAutocomplete";
import { PropertyCategory } from "@/src/common/enums";
import MobileFooter from "@/src/components/MobileFooter";
import { useGetPropertiesByLocationQuery } from "@/src/store/apiSlice";

// Lazy load Properties component
const Properties = React.lazy(() => import("./Properties"));

// Loader fallback
const ScreenLoader = () => (
  <View style={{ padding: 20 }}>
    <ActivityIndicator size="large" />
  </View>
);

type NavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PropertySearchClient"
>;

export default function PropertySearchClient() {
  const navigation = useNavigation<NavProp>();

  const [page, setPage] = useState(0);
  const [lat, setLat] = useState(12.9716);
  const [lon, setLon] = useState(77.5946);
  const [bhkFilter, setBhkFilter] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<any[]>([]);

  const queryArgs = {
    latitude: lat,
    longitude: lon,
    propertyCategory: PropertyCategory.RENT,
    page,
    size: 16,
    ...(bhkFilter ? { bhkType: bhkFilter } : {}),
  };

  const { data, isLoading, isFetching } = useGetPropertiesByLocationQuery(
    queryArgs,
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (!data?.items) return;

    setAllItems((prev) => {
      if (page === 0) return data.items;

      const map = new Map(prev.map((p) => [p.propertyID, p]));
      data.items.forEach((item: any) => {
        map.set(item.propertyID, item);
      });

      return Array.from(map.values());
    });
  }, [data, page]);

  const properties = useMemo(() => allItems, [allItems]);

  const handleLoadMore = () => {
    if (data?.hasNext && !isFetching) setPage((p) => p + 1);
  };

  // ✅ Navigate to single unified PropertyDetails screen
  const handlePropertyPress = (property: any) => {
    navigation.navigate("PropertyDetails", {
      property: property,
    });
  };

  const renderItem = ({ item }: any) => (
    <Suspense fallback={<ScreenLoader />}>
      <Properties property={item} onPress={() => handlePropertyPress(item)} />
    </Suspense>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <UnifiedSearchAutocomplete
              latitude={lat}
              longitude={lon}
              onKeywordDetected={(bhk) => {
                setBhkFilter(bhk);
                setPage(0);
                setAllItems([]);
              }}
              onSelectLocation={(lt, ln) => {
                setLat(lt);
                setLon(ln);
                setPage(0);
                setAllItems([]);
              }}
              onSelectProperty={(p) => {
                setLat(p.latitude);
                setLon(p.longitude);
                setPage(0);
                setAllItems([]);
                setBhkFilter(p.bhkType ?? null);
              }}
            />
          </View>

          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerDivider} />

        {/* LIST */}
        {isLoading && properties.length === 0 ? (
          <ScreenLoader />
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => String(item.propertyID)}
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={isFetching ? <ActivityIndicator /> : null}
          />
        )}

        <View pointerEvents="box-none">
          <MobileFooter />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerDivider: { height: 1, backgroundColor: "#E5E7EB" },
  listContent: { padding: 12, paddingBottom: 140 },
  filterBtn: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 22,
  },
});
