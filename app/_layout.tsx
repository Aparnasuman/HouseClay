import { SafeAreaProvider } from "react-native-safe-area-context";
import Providers from "../providers/Providers";
import RootNavigator from "./navigation/RootNavigator";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Providers>
        <RootNavigator />
      </Providers>
    </SafeAreaProvider>
  );
}
