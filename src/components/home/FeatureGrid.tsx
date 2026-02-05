import { RootStackParamList } from "@/app/navigation/RootNavigator";
import { PropertyCategory } from "@/src/common/enums";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FeatureGridProps {
  propertyCategory: PropertyCategory;
}

const items = [
  {
    label: "Find Flatmates",
    icon: "people",
    category: PropertyCategory.FLATMATE,
  },
  {
    label: "Find Rooms",
    icon: "bed",
    category: PropertyCategory.FLATMATE,
  },
  { label: "Weekly Standouts", icon: "diamond" },
  { label: "List Your Property", icon: "home", free: true },
];

export default function FeatureGrid({ propertyCategory }: FeatureGridProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (item: (typeof items)[number]) => {
    if (!item.category) return;

    console.log("NAVIGATE WITH:", item.category);

    navigation.navigate("PropertySearchClient", {
      propertyCategory: item.category,
    });
  };

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <Pressable style={styles.card} onPress={() => handlePress(item)}>
            {item.free && <Text style={styles.free}>FREE</Text>}
            <Ionicons name={item.icon as any} size={26} color="#E53935" />
          </Pressable>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  item: {
    width: "23%",
    alignItems: "center",
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  free: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#E53935",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
  },
});
