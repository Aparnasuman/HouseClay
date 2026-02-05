import React from "react";
import { StyleSheet, View } from "react-native";
import RootNavigator from "./navigation/RootNavigator";
export default function Index() {
  return (
    <View style={styles.container}>
      {/* You can directly render HomeScreen here */}
      <RootNavigator />

      {/* Optional: fallback / placeholder */}
      {/* <Text style={styles.placeholder}>Loading Home Screen...</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    color: "#555",
  },
});
