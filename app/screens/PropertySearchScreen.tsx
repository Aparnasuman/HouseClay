import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

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

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [propertyCategory] = useState(PropertyCategory.RENT);

  const lat = 12.9716;
  const lon = 77.5946;

  const { data, isLoading, isFetching } = useGetPropertiesByLocationQuery({
    latitude: lat,
    longitude: lon,
    propertyCategory,
    page,
  });

  const properties = useMemo(() => data?.items ?? [], [data]);

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

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search for a property"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
          />
          <Search size={18} />
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
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },

  input: {
    flex: 1,
    fontSize: 14,
  },

  iconBtn: {
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 20,
  },
});
