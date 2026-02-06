import Constants from "expo-constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GOOGLE_KEY = Constants.expoConfig?.extra?.GOOGLE_PLACES_KEY;

type Props = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  onLocationSelect?: (data: any, details: any) => void;
};

export default function PlacesAutocomplete({
  label,
  placeholder = "Search place",
  required,
  error,
  disabled,
  onLocationSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={{ color: "red" }}>*</Text>}
        </Text>
      )}

      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails
        enablePoweredByContainer={false}
        keyboardShouldPersistTaps="handled"
        debounce={300}
        minLength={2}
        onPress={(data, details) => {
          onLocationSelect?.(data, details);
        }}
        query={{
          key: GOOGLE_KEY,
          language: "en",
          components: "country:in",
        }}
        styles={{
          container: {
            flex: 0,
            zIndex: 999,
          },

          textInputContainer: {
            backgroundColor: "#E5E7EB",
            borderRadius: 24,
            paddingHorizontal: 12,
            height: 42,
            alignItems: "center",
            overflow: "hidden", // ✅ border radius fix
          },

          textInput: {
            backgroundColor: "#E5E7EB",
            borderRadius: 24,
            height: 42,
            fontSize: 14,
            paddingVertical: 0,
          },

          listView: {
            position: "absolute",
            top: 46,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderRadius: 14,
            elevation: 8,
            zIndex: 9999,
          },

          row: {
            paddingVertical: 12,
            paddingHorizontal: 14,
          },
        }}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 999,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
