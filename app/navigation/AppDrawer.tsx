import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../../src/components/customDrawer";
import MobileHeader from "../../src/components/MobileHeader";
import HomeScreen from "../screens/HomeScreen";
const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: "slide",
        drawerPosition: "left",
        swipeEdgeWidth: 50,
        overlayColor: "rgba(0,0,0,0.3)",
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => <MobileHeader />, // ✅ header inside drawer
        }}
      />
    </Drawer.Navigator>
  );
}
