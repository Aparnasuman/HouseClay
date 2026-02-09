import { PropertyCategory } from "@/src/common/enums";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
  PropertyDetails: {
    propertyID: string;
    propertyDetails?: any; // optional preloaded property
  };
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
      <Stack.Screen name="ShortlistsScreen" component={ShortlistsScreen} />

      {/* ✅ ADD THIS */}
      <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
    </Stack.Navigator>
  );
}
