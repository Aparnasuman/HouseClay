import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/src/store/apiSlice";

import { setIsAuthenticated } from "@/src/store/authSlice";
import { setUserDetail } from "@/src/store/userSlice";
import { useDispatch } from "react-redux";

import { AuthUserDetail } from "@/src/interfaces/User";

// =========================
// TYPES
// =========================

interface CreateUserParams {
  phoneNo: string;
  name: string;
  email: string;
  otp: string;
}

type UserStatus = "exists" | "new";

// =========================
// HOOK
// =========================

export const useAuthFlow = () => {
  const dispatch = useDispatch();

  const [generateOtpMutation] = useGenerateOtpMutation();
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [triggerCheckUser] = useLazyCheckUserQuery();

  // =========================
  // CHECK USER
  // =========================
  const checkUser = async (phoneNo: string): Promise<UserStatus> => {
    try {
      await triggerCheckUser({ phoneNo }).unwrap();
      return "exists";
    } catch (error: any) {
      if (error?.status === 404) {
        return "new"; // ✅ your required behavior
      }
      console.error("checkUser error:", error);
      throw new Error("checkUser failed");
    }
  };

  // =========================
  // SEND OTP
  // =========================
  const sendOTP = async (phoneNo: string): Promise<void> => {
    try {
      await generateOtpMutation({ phoneNo }).unwrap();
    } catch (error: any) {
      console.error("sendOTP error:", error);
      throw new Error("OTP send failed");
    }
  };

  // =========================
  // REGISTER USER (CREATE USER)
  // =========================
  const registerUser = async ({
    phoneNo,
    name,
    email,
    otp,
  }: CreateUserParams): Promise<AuthUserDetail> => {
    try {
      const result = await registerMutation({
        phoneNo,
        name,
        emailID: email,
        otpCode: otp,
      }).unwrap();

      // ✅ Type guard (fixes string | AuthUserDetail error)
      if (typeof result === "string") {
        throw new Error(result);
      }

      dispatch(setUserDetail(result));
      dispatch(setIsAuthenticated(true));

      return result;
    } catch (error: any) {
      console.error("registerUser error:", error);
      throw new Error(error?.data?.message || "Register failed");
    }
  };

  // =========================
  // VERIFY OTP = LOGIN USER
  // =========================
  const verifyOTPLogin = async (
    phoneNo: string,
    otp: string,
  ): Promise<AuthUserDetail> => {
    try {
      const result = await loginMutation({
        phoneNo,
        otpCode: otp,
      }).unwrap();

      if (typeof result === "string") {
        throw new Error(result);
      }

      dispatch(setUserDetail(result));
      dispatch(setIsAuthenticated(true));

      return result;
    } catch (error: any) {
      console.error("login error:", error);
      throw new Error(error?.data?.message || "Login failed");
    }
  };

  // =========================
  // EXPORT
  // =========================
  return {
    checkUser, // exists | new
    sendOTP, // send OTP
    registerUser, // create user
    verifyOTPLogin, // login
  };
};
