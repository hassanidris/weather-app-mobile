import { Stack, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { setupErrorLogging } from "utils/errorLogger";

const STORAGE_KEY = "emulated_device";

export default function RootLayout() {
  const { emulate } = useGlobalSearchParams<{ emulate?: string }>();

  useEffect(() => {
    // Set up global error logging

    setupErrorLogging();
  }, [emulate]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "default",
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
