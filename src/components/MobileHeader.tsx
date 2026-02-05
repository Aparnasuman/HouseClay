import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux"; // ✅ useSelector directly

export default function MobileHeader() {
  const navigation = useNavigation<any>();

  /* ✅ Redux selectors directly */
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated,
  );
  const user = useSelector((state: any) => state.user.userDetail);

  /* ---------------- ACTIONS ---------------- */

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openLogin = () => {
    navigation.navigate("AuthFlow"); // navigate to your AuthModal/flow
  };

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.left}>
          <Pressable onPress={openDrawer}>
            <Ionicons name="menu" size={22} />
          </Pressable>

          <Text style={styles.brand}>Houseclay</Text>
        </View>

        {/* RIGHT */}
        {isAuthenticated ? (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || "User"}</Text>

            {!!user?.phoneNo && (
              <Text style={styles.userPhone}>{user.phoneNo}</Text>
            )}
          </View>
        ) : (
          <Pressable style={styles.loginBtn} onPress={openLogin}>
            <Text style={styles.loginText}>Log In</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#fff",
  },

  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  brand: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E53935",
  },

  loginBtn: {
    borderWidth: 1,
    borderColor: "#E53935",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  loginText: {
    color: "#E53935",
    fontWeight: "600",
  },

  userInfo: {
    alignItems: "flex-end",
    maxWidth: 160,
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
  },

  userPhone: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
});
