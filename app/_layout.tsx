import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen
        name="(tabs)"
        options={{ animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
