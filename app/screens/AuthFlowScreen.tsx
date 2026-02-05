// src/screens/AuthFlowScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { AuthStep } from "@/src/common/enums";
import {
  setAuthStep,
  setLoginFromAddProperty,
  setLoginFromLoginPage,
} from "@/src/store/authSlice";
import { useAuthFlow } from "@/src/store/useAuthFlow";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function AuthFlowScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const authStep = useSelector((state: any) => state.auth.authStep);
  const loginFromAddProperty = useSelector(
    (state: any) => state.auth.loginFromAddProperty,
  );
  const loginFromLoginPage = useSelector(
    (state: any) => state.auth.loginFromLoginPage,
  );

  const [phoneNo, setPhoneNo] = useState("+91"); // default +91
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const [isNewUser, setIsNewUser] = useState(false);

  const otpRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const timerRef = useRef<number | null>(null);

  const { checkUser, sendOTP, verifyOTPLogin, registerUser } = useAuthFlow();

  // ---------------- PHONE VALIDATION ----------------
  const validPhone = /^\+91\d{10}$/.test(phoneNo);

  // ---------------- TIMER ----------------
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

  // ---------------- HANDLERS ----------------
  const handleSendOTP = async () => {
    setError("");

    if (!validPhone) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const status = await checkUser(phoneNo);

      if (status === "new") {
        // go to create user screen first
        setIsNewUser(true);
        dispatch(setAuthStep(AuthStep.CREATE_USER));
        return;
      }

      // existing user → send otp
      setIsNewUser(false);

      await sendOTP(phoneNo);

      setOtpCode(Array(OTP_LENGTH).fill(""));
      dispatch(setAuthStep(AuthStep.OTP));
      focusOtp(0);
      startTimer();
    } catch (err: any) {
      setError(err.message || "Failed");
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

      if (isNewUser) {
        await registerUser({
          phoneNo,
          name,
          email,
          otp: otpStr,
        });
      } else {
        await verifyOTPLogin(phoneNo, otpStr);
      }

      dispatch(setAuthStep(AuthStep.LOGGED_IN));
      navigateAfterLogin();
    } catch (err: any) {
      setError(err.message || "Verification failed");
      setOtpCode(Array(OTP_LENGTH).fill(""));
      focusOtp(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email) {
      setError("Please enter name and email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // send otp first
      await sendOTP(phoneNo);

      setOtpCode(Array(OTP_LENGTH).fill(""));
      dispatch(setAuthStep(AuthStep.OTP));
      focusOtp(0);
      startTimer();
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setLoading(true);
    setError("");
    try {
      await sendOTP(phoneNo);
      setOtpCode(Array(OTP_LENGTH).fill(""));
      focusOtp(0);
      startTimer();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const navigateAfterLogin = () => {
    if (loginFromLoginPage) {
      navigation.replace("Home");
      dispatch(setLoginFromLoginPage(false));
    } else if (loginFromAddProperty) {
      navigation.navigate("AddProperty");
      dispatch(setLoginFromAddProperty(false));
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (authStep === AuthStep.OTP) focusOtp(0);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(RESEND_SECONDS);
    };
  }, [authStep]);

  // ---------------- UI -------------------
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* ✅ Modal Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Log In to Your Account</Text>

          <Pressable
            onPress={() => {
              navigation.goBack();
              dispatch(setAuthStep(AuthStep.PHONE));
            }}
          >
            <Ionicons name="close" size={24} color="#555" />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          {/* PHONE STEP */}
          {authStep === AuthStep.PHONE && (
            <View style={styles.formContainer}>
              <Text>
                <Text style={styles.title}>No spam </Text>
                <Text style={styles.p}>just Updates</Text>
              </Text>
              <Text style={styles.subtitle}>Phone Number</Text>
              <TextInput
                placeholder="+91XXXXXXXXXX"
                keyboardType="number-pad"
                maxLength={13} // +91 + 10 digits
                value={phoneNo}
                onChangeText={(text) => {
                  // Remove non-digits
                  let digits = text.replace(/\D/g, "");

                  // Ensure prefix 91
                  if (!digits.startsWith("91")) digits = "91" + digits;

                  setPhoneNo("+" + digits.slice(0, 12));
                }}
                style={styles.input}
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
              <Pressable
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </Pressable>
            </View>
          )}

          {/* OTP STEP */}
          {authStep === AuthStep.OTP && (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Verify Your Phone Number</Text>
              <Text style={styles.subtitle}>Code sent to {phoneNo}</Text>
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
                  (!otpCode.every((d) => d) || loading) &&
                    styles.buttonDisabled,
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

          {/* CREATE USER STEP */}
          {authStep === AuthStep.CREATE_USER && (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create New Account</Text>
              <TextInput
                placeholder="+91XXXXXXXXXX"
                keyboardType="number-pad"
                maxLength={13} // +91 + 10 digits
                value={phoneNo}
                onChangeText={(text) => {
                  // Remove non-digits
                  let digits = text.replace(/\D/g, "");

                  // Ensure prefix 91
                  if (!digits.startsWith("91")) digits = "91" + digits;

                  setPhoneNo("+" + digits.slice(0, 12));
                }}
                style={styles.input}
              />
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
              <Pressable
                style={[
                  styles.button,
                  (!name || !email || loading) && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={!name || !email || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  p: {
    fontSize: 30,
    lineHeight: 22,
    color: "#444",
  },
  body: { flex: 1 },
  formContainer: { padding: 16, justifyContent: "center" },
  title: { fontSize: 30, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 20, color: "#666", marginBottom: 24 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  modalTitle: {
    fontSize: 18,
  },

  button: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonDisabled: { backgroundColor: "#fca5a5" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  error: { color: "red", marginTop: 8, textAlign: "center" },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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
  resend: { textAlign: "center", marginTop: 12, color: "#666" },
  resendActive: {
    textAlign: "center",
    marginTop: 12,
    color: "#ef4444",
    fontWeight: "600",
  },
});
