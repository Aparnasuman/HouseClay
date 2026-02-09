import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { PropertyCategory } from "@/src/common/enums";
import { PropertySearch } from "@/src/interfaces/PropertySearch";
import { useLazyGetPropertiesByLocationQuery } from "@/src/store/apiSlice";

const GOOGLE_KEY = Constants.expoConfig?.extra?.GOOGLE_PLACES_KEY;

type Props = {
  latitude: number;
  longitude: number;
  onSelectLocation: (lat: number, lon: number) => void;
  onSelectProperty: (p: PropertySearch) => void;
  onKeywordDetected: (bhk: string | null) => void;
};

function parseBHK(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("1bhk")) return "1BHK";
  if (t.includes("2bhk")) return "2BHK";
  if (t.includes("3bhk")) return "3BHK";
  if (t.includes("4bhk")) return "4BHK";
  return null;
}

export default function UnifiedSearchAutocomplete(props: Props) {
  const {
    latitude,
    longitude,
    onSelectLocation,
    onSelectProperty,
    onKeywordDetected,
  } = props;

  const [text, setText] = useState("");
  const [propertyResults, setPropertyResults] = useState<PropertySearch[]>([]);
  const [loading, setLoading] = useState(false);

  const googleRef = useRef<any>(null);
  const [trigger] = useLazyGetPropertiesByLocationQuery();

  // ✅ debounce search
  useEffect(() => {
    const t = setTimeout(() => runSearch(text), 350);
    return () => clearTimeout(t);
  }, [text]);

  const runSearch = async (q: string) => {
    const bhk = parseBHK(q);
    onKeywordDetected(bhk);

    if (!q || q.length < 2) {
      setPropertyResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await trigger({
        latitude,
        longitude,
        propertyCategory: PropertyCategory.RENT,
        page: 0,
        size: 8,
        ...(bhk ? { bhkType: bhk } : {}),
      }).unwrap();

      setPropertyResults(res.items ?? []);
    } catch {
      setPropertyResults([]);
    }

    setLoading(false);
  };

  return (
    <View style={styles.wrapper}>
      <GooglePlacesAutocomplete
        ref={googleRef}
        placeholder="Search society, property, 3bhk..."
        fetchDetails
        enablePoweredByContainer={false}
        debounce={300}
        query={{
          key: GOOGLE_KEY,
          language: "en",
          components: "country:in",
        }}
        textInputProps={{
          value: text,
          onChangeText: setText,
        }}
        styles={{
          textInputContainer: styles.inputWrap,
          textInput: styles.input,
          listView: { display: "none" }, // hide default
        }}
      />

      {/* ✅ ABSOLUTE DROPDOWN */}
      {(propertyResults.length > 0 || loading) && (
        <View style={styles.dropdown}>
          {loading && <ActivityIndicator />}

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={propertyResults}
            keyExtractor={(i) => i.propertyID}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  onSelectProperty(item);
                  onSelectLocation(item.latitude, item.longitude);
                  setText(item.locationOrSocietyName);
                  setPropertyResults([]);
                }}
              >
                <Text style={styles.label}>
                  {item.bhkType} — {item.locationOrSocietyName}
                </Text>
                <Text style={styles.sub}>{item.city}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 999,
    flex: 1,
  },

  inputWrap: {
    backgroundColor: "#E5E7EB",
    borderRadius: 24,
  },

  input: {
    height: 42,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
  },

  dropdown: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 10,
    maxHeight: 300,
  },

  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  label: { fontWeight: "600" },
  sub: { fontSize: 12, color: "#666" },
});
