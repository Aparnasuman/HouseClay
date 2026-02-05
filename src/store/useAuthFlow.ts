import {
  useGenerateOtpMutation,
  useLazyCheckUserQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/src/store/apiSlice";
import { setIsAuthenticated } from "@/src/store/authSlice";
import { setUserDetail } from "@/src/store/userSlice";
import { useDispatch } from "react-redux";

interface RegisterParams {
  phoneNo: string;
  name: string;
  email: string;
  otp: string;
}

export const useAuthFlow = () => {
  const dispatch = useDispatch();

  // RTK mutations
  const [generateOtpMutation] = useGenerateOtpMutation();
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  // RTK lazy query for checkUser
  const [triggerCheckUser] = useLazyCheckUserQuery();

  /**
   * Check if user exists
   * FIX: We pass a simple object { phoneNo } to match the
   * (phoneNo) => ... destructured argument in your apiSlice.
   */
  const checkUser = async (phoneNo: string): Promise<boolean> => {
    try {
      // IN REACT NATIVE: Pass the object exactly as the slice expects it.
      // Do NOT use FormData here if the slice is using URL Params.
      const result = await triggerCheckUser({ phoneNo }).unwrap();

      return !!result?.exists;
    } catch (error: any) {
      console.error("checkUser error:", error);
      // Usually, if a user doesn't exist, some APIs return 404.
      // We return false to indicate the user needs to register.
      return false;
    }
  };

  const sendOTP = async (phoneNo: string): Promise<void> => {
    try {
      await generateOtpMutation({ phoneNo }).unwrap();
    } catch (error: any) {
      console.error("sendOTP error:", error);
      throw error;
    }
  };

  const verifyOTP = async (phoneNo: string, otp: string): Promise<boolean> => {
    try {
      const result = await loginMutation({ phoneNo, otpCode: otp }).unwrap();
      if (result && typeof result !== "string") {
        dispatch(setUserDetail(result));
        dispatch(setIsAuthenticated(true));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("verifyOTP error:", error);
      throw error;
    }
  };

  const registerUser = async ({
    phoneNo,
    name,
    email,
    otp,
  }: RegisterParams): Promise<void> => {
    try {
      const result = await registerMutation({
        phoneNo,
        name,
        emailID: email,
        otpCode: otp,
      }).unwrap();

      dispatch(setUserDetail(result));
      dispatch(setIsAuthenticated(true));
    } catch (error: any) {
      console.error("registerUser error:", error);
      throw error;
    }
  };

  return {
    checkUser,
    sendOTP,
    verifyOTP,
    registerUser,
  };
};
