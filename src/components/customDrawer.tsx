// src/components/CustomDrawer.tsx
import { logout } from "@/src/store/authSlice";
import { clearUserDetail } from "@/src/store/userSlice";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { useAuthFlow } from "@/src/store/useAuthFlow";

import { setLoginFromLoginPage } from "@/src/store/authSlice";

// ---------------- MENU ITEMS ----------------
const menuItems = [
  { label: "Rent", route: "Rent" },
  { label: "Rooms", route: "Rooms" },
  { label: "About Us", route: "AboutUs" },
  { label: "Contact", route: "Contact" },
  { label: "Privacy Policy", route: "PrivacyPolicy" },
  { label: "Terms & Conditions", route: "Terms" },
];

export default function CustomDrawer({
  navigation,
}: DrawerContentComponentProps) {
  const dispatch = useDispatch();
  const { sendOTP } = useAuthFlow(); // ✅ use your custom hook for auth actions

  const isAuthenticated = useSelector((s: any) => s.auth.isAuthenticated);
  const user = useSelector((s: any) => s.user.userDetail);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserDetail());
    navigation.closeDrawer();
  };

  // ---------------- OPEN LOGIN ----------------
  const openLogin = () => {
    dispatch(setLoginFromLoginPage(true)); // tells AuthFlow which UI to show// set to PHONE step
    navigation.closeDrawer();
    navigation.navigate("AuthFlow"); // navigate to AuthFlow screen
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.closeDrawer()}>
            <Ionicons name="close" size={24} />
          </Pressable>

          <Text style={styles.title}>Menu</Text>

          {!isAuthenticated && (
            <Pressable style={styles.loginBtn} onPress={openLogin}>
              <Text style={styles.loginText}>Log In</Text>
            </Pressable>
          )}
        </View>

        {/* USER INFO */}
        {isAuthenticated && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userPhone}>{user?.phoneNo || "-"}</Text>

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="red" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        )}

        {/* MENU ITEMS */}
        {menuItems.map(({ label, route }) => (
          <Pressable
            key={label}
            style={styles.item}
            onPress={() => {
              navigation.navigate(route);
              navigation.closeDrawer();
            }}
          >
            <Text style={styles.itemText}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 16,
  },

  title: { fontSize: 18, fontWeight: "600" },

  loginBtn: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  loginText: { color: "red", fontWeight: "600" },

  userInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  userName: { fontSize: 16, fontWeight: "600" },

  userPhone: { fontSize: 14, color: "#666", marginTop: 4 },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },

  logoutText: { color: "red", fontWeight: "600" },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  itemText: { fontSize: 16 },
});
