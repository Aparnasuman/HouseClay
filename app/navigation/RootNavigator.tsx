import { PropertyCategory } from "@/src/common/enums";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PropertySearch } from "@/src/interfaces/PropertySearch";
import AuthFlowScreen from "../screens/AuthFlowScreen";
import PropertyDetails from "../screens/PropertyDetails";
import PropertySearchClient from "../screens/PropertySearchScreen";
import ShortlistsScreen from "../screens/ShortListedScreen";
import AppDrawer from "./AppDrawer";

export type RootStackParamList = {
  AppDrawer: undefined;
  AuthFlow: undefined;
  PropertySearchClient: { propertyCategory: PropertyCategory };
  ShortlistsScreen: undefined;
  LoginScreen: undefined;
  PropertyDetails: { property: PropertySearch }; // ✅ added
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppDrawer" component={AppDrawer} />
      <Stack.Screen name="AuthFlow" component={AuthFlowScreen} />
      <Stack.Screen
        name="PropertySearchClient"
        component={PropertySearchClient}
      />
      <Stack.Screen
        name="ShortlistsScreen"
        component={ShortlistsScreen}
        options={{
          animation: "slide_from_bottom",
        }}
      />

      {/* ✅ ADD THIS */}
      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetails}
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}
