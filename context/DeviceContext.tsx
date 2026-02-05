"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Dimensions } from "react-native";

interface DeviceContextProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

export const DeviceContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<DeviceContextProps>({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  });

  const update = () => {
    const width = Dimensions.get("window").width;
    setState({
      isMobile: width < 768,
      isTablet: width >= 768 && width <= 1024,
      isDesktop: width > 1024,
    });
  };

  useEffect(() => {
    update();
    const subscription = Dimensions.addEventListener("change", update);
    return () => subscription.remove();
  }, []);

  return (
    <DeviceContext.Provider value={state}>{children}</DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be inside DeviceContextProvider");
  return ctx;
};
