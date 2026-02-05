import { PropertyCategory } from "@/src/common/enums";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthFlowScreen from "../screens/AuthFlowScreen";
import PropertySearchClient from "../screens/PropertySearchScreen";
import AppDrawer from "./AppDrawer";

export type RootStackParamList = {
  AppDrawer: undefined;
  AuthFlow: undefined;
  PropertySearchClient: { propertyCategory: PropertyCategory };
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
    </Stack.Navigator>
  );
}
