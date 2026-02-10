import { setLoginFromLoginPage } from "@/src/store/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { RootStackParamList } from "../../app/navigation/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MobileFooter() {
  const navigation = useNavigation<Nav>();

  const dispatch = useDispatch();

  const openLogin = () => {
    dispatch(setLoginFromLoginPage(false)); // tells AuthFlow which UI to show
    navigation.navigate("AuthFlow");
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.footer}>
        {/* Explore */}
        <Pressable style={styles.item}>
          <Ionicons name="search-outline" size={24} color="#6a6464" />
          <Text style={styles.label}>Explore</Text>
        </Pressable>

        {/* Shortlists */}
        <Pressable
          style={styles.item}
          onPress={() => navigation.navigate("ShortlistsScreen")}
        >
          <Ionicons name="heart-outline" size={24} color="#6a6464" />
          <Text style={styles.label}>Shortlists</Text>
        </Pressable>

        {/* Home → Drawer → Home */}
        <Pressable
          style={styles.item}
          onPress={() =>
            navigation.navigate("AppDrawer", {
              screen: "Home",
            } as never)
          }
        >
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={[styles.label, { color: "#000", fontWeight: "600" }]}>
            Home
          </Text>
        </Pressable>

        {/* Contacts */}
        <Pressable
          style={styles.item}
          onPress={() => navigation.navigate("AuthFlow")}
        >
          <Ionicons name="call-outline" size={24} color="#6a6464" />
          <Text style={styles.label}>Contacts</Text>
        </Pressable>

        {/* Profile */}
        <Pressable style={styles.item} onPress={openLogin}>
          <Ionicons name="person-outline" size={24} color="#6a6464" />
          <Text style={styles.label}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  item: {
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#6a6464",
  },
});
