import React from "react";
import { Provider } from "react-redux";

import { DeviceContextProvider } from "@/context/DeviceContext";
import { DialogContextProvider } from "@/context/DialogContext";
import { store } from "@/src/store/store";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <DeviceContextProvider>
        <DialogContextProvider>{children}</DialogContextProvider>
      </DeviceContextProvider>
    </Provider>
  );
}
