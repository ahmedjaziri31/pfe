import { Stack, router } from "expo-router";
import { ThemeProvider } from "@shared/providers/themeProvider";
import { FontProvider } from "@shared/providers/fontProvider";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "../config/gluestack-ui.config";
// Import global CSS for NativeWind
import "../../global.css";

import { authStore } from "./auth/services/authStore";
import { useEffect, useState } from "react";
import { isJwtTokenValid } from "@/shared/utils/token";
import { handleBiometricAuth } from "@/shared/utils/biometricAuth";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const loadTokens = authStore((state) => state.loadTokens);
  const accessToken = authStore((state) => state.accessToken);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      await loadTokens();

      if (isJwtTokenValid(accessToken)) {
        const biometric = await handleBiometricAuth();
        if (biometric.success) {
          router.replace("/main/screens/(tabs)/properties");
        } else {
          // biometric failed: stay on login
        }
      }

      setCheckingSession(false);
    };

    authenticate();
  }, []);

  if (checkingSession) {
    return (
      <GluestackUIProvider config={config}>
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider config={config}>
    <FontProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Home" }} />
        </Stack>
      </ThemeProvider>
    </FontProvider>
    </GluestackUIProvider>
  );
}
