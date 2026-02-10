import { AuthStep } from "@/src/common/enums";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function LoginScreen() {
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.PHONE);

  const [phoneNo, setPhoneNo] = useState("+91");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validPhone = /^\+91\d{10}$/.test(phoneNo);

  // OTP States
  const [otpCode, setOtpCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    setTimeLeft(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const focusOtp = (index: number) => {
    setTimeout(() => otpRefs.current[index]?.focus(), 50);
  };

  const setOtpRef = (ref: TextInput | null, index: number) => {
    otpRefs.current[index] = ref;
  };

  const handleContinue = async () => {
    if (!validPhone || !acceptTerms) return;

    setError("");
    setLoading(true);

    try {
      // Replace this with your real send OTP API
      await new Promise((res) => setTimeout(res, 1000));

      setAuthStep(AuthStep.OTP);
      setOtpCode(Array(OTP_LENGTH).fill(""));
      focusOtp(0);
      startTimer();
    } catch (err: any) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(0, 1);
    setOtpCode(newOtp);
    if (value && index < OTP_LENGTH - 1) focusOtp(index + 1);
  };

  const handleOtpKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && !otpCode[index] && index > 0) {
      focusOtp(index - 1);
    }
  };

  const handleVerify = async () => {
    if (otpCode.some((d) => !d)) return;

    setLoading(true);
    setError("");

    try {
      const otpStr = otpCode.join("");
      // Replace this with your real verify API
      await new Promise((res) => setTimeout(res, 1000));
      alert("Logged in successfully with OTP: " + otpStr);

      // Reset everything after login
      setAuthStep(AuthStep.PHONE);
      setPhoneNo("+91");
      setAcceptTerms(false);
      setOtpCode(Array(OTP_LENGTH).fill(""));
    } catch (err: any) {
      setError("Verification failed");
      setOtpCode(Array(OTP_LENGTH).fill(""));
      focusOtp(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;

    setLoading(true);
    setError("");
    try {
      // Replace this with your real resend OTP API
      await new Promise((res) => setTimeout(res, 1000));
      setOtpCode(Array(OTP_LENGTH).fill(""));
      focusOtp(0);
      startTimer();
    } catch (err: any) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {authStep === AuthStep.PHONE && (
          <View style={styles.form}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="+91XXXXXXXXXX"
              keyboardType="number-pad"
              maxLength={13}
              value={phoneNo}
              onChangeText={(text) => {
                let digits = text.replace(/\D/g, "");
                if (!digits.startsWith("91")) digits = "91" + digits;
                setPhoneNo("+" + digits.slice(0, 12));
              }}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checked]} />
              <Text style={styles.terms}>Accept terms & privacy</Text>
            </TouchableOpacity>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable
              style={[
                styles.button,
                (!validPhone || !acceptTerms || loading) &&
                  styles.buttonDisabled,
              ]}
              disabled={!validPhone || !acceptTerms || loading}
              onPress={handleContinue}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </Pressable>
          </View>
        )}

        {authStep === AuthStep.OTP && (
          <View style={styles.form}>
            <Text style={styles.label}>Enter OTP sent to {phoneNo}</Text>
            <View style={styles.otpRow}>
              {Array.from({ length: OTP_LENGTH }, (_, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => setOtpRef(ref, i)}
                  value={otpCode[i]}
                  onChangeText={(v) => handleOtpChange(i, v)}
                  onKeyPress={(e) => handleOtpKeyPress(i, e)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.otpInput}
                  textAlign="center"
                />
              ))}
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable
              style={[
                styles.button,
                (!otpCode.every((d) => d) || loading) && styles.buttonDisabled,
              ]}
              onPress={handleVerify}
              disabled={!otpCode.every((d) => d) || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </Pressable>
            {timeLeft === 0 ? (
              <Pressable onPress={handleResend}>
                <Text style={styles.resendActive}>Resend OTP</Text>
              </Pressable>
            ) : (
              <Text style={styles.resend}>Resend in {timeLeft}s</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  form: { backgroundColor: "#fff", padding: 16, borderRadius: 12 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#9ca3af",
    borderRadius: 4,
    marginRight: 8,
  },
  checked: { backgroundColor: "#ef4444", borderColor: "#ef4444" },
  terms: { fontSize: 14, color: "#4b5563" },
  button: { backgroundColor: "#ef4444", padding: 14, borderRadius: 10 },
  buttonDisabled: { backgroundColor: "#fca5a5" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  error: { color: "red", textAlign: "center", marginTop: 8 },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    fontSize: 22,
    backgroundColor: "#fff",
  },
  resend: { textAlign: "center", color: "#666", marginTop: 8 },
  resendActive: {
    textAlign: "center",
    color: "#ef4444",
    marginTop: 8,
    fontWeight: "600",
  },
});
