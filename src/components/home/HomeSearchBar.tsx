import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface HomeSearchBarProps {
  onSearch?: (query: string) => void;
}

export default function HomeSearchBar({ onSearch }: HomeSearchBarProps) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(searchText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Koramangala"
        style={styles.input}
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Pressable style={styles.searchBtn} onPress={handleSearch}>
        <Ionicons name="search" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: "#E53935",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
