import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import PlacesAutocomplete from "@/src/base_component/PlacesAutocomplete";
import { PropertyCategory } from "@/src/common/enums";
import { useGetPropertiesByLocationQuery } from "@/src/store/apiSlice";
import Properties from "./Properties";

type RootStackParamList = {
  PropertySearchClient: { propertyCategory: PropertyCategory };
  PropertyDetails: { id: number };
};

type NavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PropertySearchClient"
>;

export default function PropertySearchClient() {
  const navigation = useNavigation<NavProp>();

  const [page, setPage] = useState(0);
  const [propertyCategory] = useState(PropertyCategory.RENT);

  const [lat, setLat] = useState(12.9716);
  const [lon, setLon] = useState(77.5946);

  // ✅ force refetch when lat/lon/page change
  const { data, isLoading, isFetching } = useGetPropertiesByLocationQuery(
    {
      latitude: lat,
      longitude: lon,
      propertyCategory,
      page,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const properties = useMemo(() => data?.items ?? [], [data]);

  const handleLocationSelect = (_data: any, details: any) => {
    console.log("PLACE SELECTED:", details);

    const loc = details?.geometry?.location;
    if (!loc) return;

    setLat(loc.lat);
    setLon(loc.lng);
    setPage(0);
  };

  const handleLoadMore = () => {
    if (data?.hasNext && !isFetching) {
      setPage((p) => p + 1);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PropertyDetails", { id: item.propertyID })
      }
    >
      <Properties property={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <PlacesAutocomplete
            placeholder="Search location"
            onLocationSelect={handleLocationSelect}
          />
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <SlidersHorizontal size={18} />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(i) => i.propertyID.toString()}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetching ? <ActivityIndicator /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 50,
    paddingHorizontal: 12,
    overflow: "visible",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    zIndex: 50,
    overflow: "visible",
  },

  iconBtn: {
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 20,
  },
});
