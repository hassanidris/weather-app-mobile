import { tabsIconProp } from "@/types/types";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { JSX } from "react";

const TabIcons = ({ icon, color }: tabsIconProp): JSX.Element => {
  return (
    <Image source={icon} tintColor={color} style={{ width: 26, height: 26 }} />
  );
};
const TabsLayout = () => {
  return (
    <Tabs
   
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#ff914d",
        tabBarStyle: {
          backgroundColor: "#000",
          height: "100%",
        },
        tabBarItemStyle: {
            height: 66
        },
        tabBarLabelStyle:{
            display: "flex"
        },
        tabBarHideOnKeyboard: true
      }}
    >
      <Tabs.Screen name="Home"  options={{headerShown: false,
        tabBarIcon: ({Color, focused}) => (
            
        )
      }}
      
      />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
};

export default TabsLayout;
