// src/store/userSlice.ts
import {
  PropertyCardWithImages,
  UserExternalPayment,
  UserOwnedProperties,
} from "@/src/interfaces/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserDetail {
  name: string;
  emailID: string;
  phoneNo: string;
  connectBal: number;
  avatarUrl: string | null;
  onWhatsApp: boolean;
  emailVerified: boolean;
  ownedProperties: UserOwnedProperties[];
  externalPayments: UserExternalPayment[];
  contactedProperties: PropertyCardWithImages[];
}

interface UserState {
  userDetail: UserDetail;
  userDetailLoading: boolean;
  userDetailError?: string;
  checkUser?: { exists: boolean; message: string };
}

const initialState: UserState = {
  userDetail: {
    name: "",
    emailID: "",
    phoneNo: "",
    connectBal: 0,
    avatarUrl: null,
    onWhatsApp: false,
    emailVerified: false,
    ownedProperties: [],
    externalPayments: [],
    contactedProperties: [],
  },
  userDetailLoading: false,
  userDetailError: undefined,
  checkUser: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetail(state, action: PayloadAction<Partial<UserDetail>>) {
      Object.assign(state.userDetail, action.payload);
    },
    clearUserDetail(state) {
      state.userDetail = initialState.userDetail;
    },
    setUserDetailLoading(state, action: PayloadAction<boolean>) {
      state.userDetailLoading = action.payload;
    },
    setUserDetailError(state, action: PayloadAction<string | undefined>) {
      state.userDetailError = action.payload;
    },
    setCheckUser(
      state,
      action: PayloadAction<{ exists: boolean; message: string }>,
    ) {
      state.checkUser = action.payload;
    },
    clearCheckUser(state) {
      state.checkUser = undefined;
    },
    clearAllUserData() {
      return initialState;
    },
  },
});

export const {
  setUserDetail,
  clearUserDetail,
  setUserDetailLoading,
  setUserDetailError,
  setCheckUser,
  clearCheckUser,
  clearAllUserData,
} = userSlice.actions;
export default userSlice.reducer;
