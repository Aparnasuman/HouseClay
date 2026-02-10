import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PhoneStepProps = {
  phoneNo: string;
  onChangePhone: (text: string) => void;
  error: string;
  loading: boolean;
  onContinue: () => void;
};

export default function PhoneStepProfileUI({
  phoneNo,
  onChangePhone,
  error,
  loading,
  onContinue,
}: PhoneStepProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={22} />
        <Text style={styles.brand}>houseclay</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>

        {/* Phone Box */}
        <View style={styles.phoneBox}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.code}>+91</Text>

          <TextInput
            value={phoneNo.replace("+91", "")}
            onChangeText={(t) => onChangePhone("+91" + t)}
            keyboardType="number-pad"
            placeholder="Enter number"
            style={styles.input}
            maxLength={10}
          />
        </View>

        {/* Terms */}
        <Pressable
          style={styles.termsRow}
          onPress={() => setAccepted(!accepted)}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxActive]} />
          <Text style={styles.termsText}>
            I accept the <Text style={styles.link}>Terms of Service</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </Pressable>

        {!!error && <Text style={styles.error}>{error}</Text>}

        {/* Login Button */}
        <Pressable
          style={[
            styles.loginBtn,
            (!accepted || loading) && styles.loginBtnDisabled,
          ]}
          onPress={onContinue}
          disabled={!accepted || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </Pressable>

        <Text style={styles.helper}>Don't worry we won't spam you.</Text>

        {/* Trust block */}
        <View style={styles.trust}>
          <Ionicons name="shield-checkmark" size={22} color="#6b7280" />
          <Text style={styles.trustText}>
            More than 800+ owners have listed their properties on Houseclay and
            closed their deal.
          </Text>
        </View>
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
    height: 56,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e53935",
  },

  form: {
    padding: 20,
    marginTop: 40,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#374151",
    fontWeight: "600",
  },

  phoneBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 52,
    paddingHorizontal: 12,
  },

  flag: { fontSize: 18, marginRight: 6 },
  code: { fontSize: 16, marginRight: 8 },

  input: {
    flex: 1,
    fontSize: 16,
  },

  termsRow: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#9ca3af",
    marginRight: 10,
    borderRadius: 4,
  },

  checkboxActive: {
    backgroundColor: "#e53935",
    borderColor: "#e53935",
  },

  termsText: {
    flex: 1,
    color: "#4b5563",
  },

  link: {
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  loginBtn: {
    backgroundColor: "#ef9a9a",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },

  loginBtnDisabled: {
    opacity: 0.6,
  },

  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },

  helper: {
    textAlign: "center",
    marginTop: 12,
    color: "#6b7280",
  },

  trust: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },

  trustText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 10,
    fontSize: 13,
  },

  error: {
    color: "red",
    marginTop: 8,
  },
});
