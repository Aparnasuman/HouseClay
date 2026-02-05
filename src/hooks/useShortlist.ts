// src/hooks/useShortlist.ts
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCardWithImages } from "@/src/interfaces/User";
import {
    useLazyGetShortlistedPropertiesQuery,
    useRemoveShortlistedPropertyMutation,
    useShortlistPropertyMutation,
} from "@/src/store/apiSlice";
import { logout } from "@/src/store/authSlice";
import {
    addToShortlist,
    removeFromShortlist,
    setShortlistedProperties,
} from "@/src/store/shortlistPropertySlice";
import { RootState } from "@/src/store/store";

export const useShortlist = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { shortlistedProperties } = useSelector(
    (state: RootState) => state.shortlist,
  );

  const [shortlistProperty] = useShortlistPropertyMutation();
  const [removeShortlistedProperty] = useRemoveShortlistedPropertyMutation();
  const [getShortlistedProperties] = useLazyGetShortlistedPropertiesQuery();

  const fetchShortlistedProperties = useCallback(async () => {
    if (!isAuthenticated) return [];
    try {
      const result = await getShortlistedProperties().unwrap();
      const items = result.shortlistedProperties ?? [];
      dispatch(setShortlistedProperties(items));
      return items;
    } catch (error) {
      console.warn("Shortlist fetch error:", error);
      return [];
    }
  }, [isAuthenticated, getShortlistedProperties, dispatch]);

  const toggleShortlist = useCallback(
    async (property: PropertyCardWithImages) => {
      if (!isAuthenticated) {
        navigation.navigate("Auth"); // RN replacement for login dialog
        return false;
      }

      const propertyId = property.propertyID;
      const isCurrentlyShortlisted = shortlistedProperties.some(
        (p) => p.propertyID === propertyId,
      );

      try {
        if (isCurrentlyShortlisted) {
          await removeShortlistedProperty({ propertyId }).unwrap();
          dispatch(removeFromShortlist(propertyId));
          Toast.show({ type: "success", text1: "Removed from shortlist" });
        } else {
          await shortlistProperty({ propertyId }).unwrap();
          dispatch(addToShortlist(property));
          Toast.show({ type: "success", text1: "Added to shortlist" });
        }
        return !isCurrentlyShortlisted;
      } catch (error: any) {
        if (error?.status === 401) {
          dispatch(logout());
          navigation.navigate("Auth");
          Toast.show({ type: "error", text1: "Login required" });
        } else {
          Toast.show({ type: "error", text1: "Failed to update shortlist" });
        }
        return isCurrentlyShortlisted;
      }
    },
    [
      isAuthenticated,
      shortlistedProperties,
      removeShortlistedProperty,
      shortlistProperty,
      dispatch,
      navigation,
    ],
  );

  const isShortlisted = useCallback(
    (propertyId: string) =>
      shortlistedProperties.some((p) => p.propertyID === propertyId),
    [shortlistedProperties],
  );

  return {
    toggleShortlist,
    isShortlisted,
    fetchShortlistedProperties,
    isAuthenticated,
  };
};
