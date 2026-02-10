import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PhoneStepLoginUIProps = {
  phoneNo: string;
  onChangePhone: (text: string) => void;
  error: string;
  loading: boolean;
  onContinue: () => void;
  onClose?: () => void;
};

export default function PhoneStepLoginUI({
  phoneNo,
  onChangePhone,
  error,
  loading,
  onContinue,
  onClose,
}: PhoneStepLoginUIProps) {
  const localNumber = phoneNo.replace("+91", "");

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Log In to Your Account</Text>

        <Pressable onPress={onClose}>
          <View style={styles.closeCircle}>
            <Ionicons name="close" size={18} color="#555" />
          </View>
        </Pressable>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.bigTitle}>
          <Text style={{ fontWeight: "800" }}>No spam</Text>, just updates.
        </Text>

        {/* Label */}
        <Text style={styles.label}>Phone Number</Text>

        {/* Phone Input */}
        <View style={styles.phoneBox}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.code}>+91</Text>

          <TextInput
            value={localNumber}
            onChangeText={(t) => onChangePhone("+91" + t)}
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
            placeholder="Enter number"
          />
        </View>

        <Text style={styles.helperText}>
          We'll text you to confirm your number.
        </Text>

        {!!error && <Text style={styles.error}>{error}</Text>}

        {/* Button */}
        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </Pressable>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing to use this service, you agree to our{" "}
          <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  header: {
    height: 64,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  closeCircle: {
    position: "absolute",
    right: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  body: {
    padding: 24,
    marginTop: 40,
  },

  bigTitle: {
    fontSize: 26,
    color: "#111",
    marginBottom: 32,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },

  phoneBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },

  flag: { fontSize: 18, marginRight: 6 },
  code: { fontSize: 15, marginRight: 6 },

  input: {
    flex: 1,
    fontSize: 16,
  },

  helperText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  terms: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 16,
    lineHeight: 18,
  },

  link: {
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  error: {
    color: "red",
    marginBottom: 12,
  },
});
