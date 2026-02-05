import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthFlowScreen from "../screens/AuthFlowScreen";
import AppDrawer from "./AppDrawer";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main App */}
      <Stack.Screen name="AppDrawer" component={AppDrawer} />

      {/* Auth Flow Modal */}
      <Stack.Screen
        name="AuthFlow"
        component={AuthFlowScreen}
        options={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
}
