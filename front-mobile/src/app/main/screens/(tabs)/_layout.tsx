import { Tabs } from "expo-router";
import { View } from "react-native";
import CustomTabBar from "@/shared/components/CustomTabBar";

export default function TabLayout() {
  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide the default tab bar
        }}
      >
        <Tabs.Screen name="properties" options={{ title: "Properties" }} />
        <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />
        <Tabs.Screen name="portfolio" options={{ title: "Portfolio" }} />
        <Tabs.Screen name="chatbot" options={{ title: "Chatbot" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
      
      {/* Custom Tab Bar */}
      <CustomTabBar />
    </View>
  );
}
