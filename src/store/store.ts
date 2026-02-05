// store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import { apiSlice } from "./apiSlice";
import authReducer from "./authSlice";
import deleteFromS3SliceReducer from "./deleteFromS3Slice";
import editPropertyReducer from "./editPropertySlice";
import listPropertyReducer from "./listPropertySlice";
import propertySearchReducer from "./propertySearchSlice";
import shortlistReducer from "./shortlistPropertySlice";
import uploadToS3SliceReducer from "./uploadToS3Slice";
import userReducer from "./userSlice";

// ✅ Helper function to create persist config
const createPersistConfig = (key: string, whitelist: string[]) => ({
  key,
  storage: AsyncStorage,
  whitelist,
});

// Persist configurations
const listPropertyPersistConfig = createPersistConfig("listProperty", [
  "form",
  "propertyCategory",
  "propertyID",
  "propertyImagesS3Url",
  "propertyImages",
]);

const editPropertyPersistConfig = createPersistConfig("editProperty", [
  "form",
  "propertyCategory",
  "propertyID",
  "propertyImagesS3Url",
  "propertyImages",
]);

const propertySearchPersistConfig = createPersistConfig("propertySearch", [
  "location",
  "confirmedLocationName",
  "propertyType",
  "bhkType",
  "propertyCategory",
  "nonVegAllowed",
  "preferredTenants",
  "tenantType",
  "roomType",
  "balconyType",
  "bathroomType",
  "furnishing",
  "availability",
  "amenities",
  "parking",
  "priceRangeForRent",
  "priceRangeForFlatmate",
  "priceRangeForBuy",
  "sortFields",
  "sortOrder",
]);

const shortlistPersistConfig = createPersistConfig("shortlist", [
  "shortlistedProperties",
]);

const authPersistConfig = createPersistConfig("auth", [
  "isAuthenticated",
  "authStep",
  "loginFromAddProperty",
]);

const userPersistConfig = createPersistConfig("user", ["userDetail"]);

// Persisted reducers
const persistedListPropertyReducer = persistReducer(
  listPropertyPersistConfig,
  listPropertyReducer,
);

const persistedEditPropertyReducer = persistReducer(
  editPropertyPersistConfig,
  editPropertyReducer,
);

const persistedPropertySearchReducer = persistReducer(
  propertySearchPersistConfig,
  propertySearchReducer,
);

const persistedShortlistReducer = persistReducer(
  shortlistPersistConfig,
  shortlistReducer,
);

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Configure store
export function makeStore() {
  return configureStore({
    reducer: {
      auth: persistedAuthReducer,
      user: persistedUserReducer,
      listProperty: persistedListPropertyReducer,
      editProperty: persistedEditPropertyReducer,
      propertySearch: persistedPropertySearchReducer,
      shortlist: persistedShortlistReducer,
      uploadToS3: uploadToS3SliceReducer,
      deleteFromS3: deleteFromS3SliceReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(apiSlice.middleware),
  });
}

// Create store and persistor
export const store = makeStore();
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
