import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  return (
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="thread" />
        <Stack.Screen name="makeThread" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="post" />
        <Stack.Screen name="makePost" />
        <Stack.Screen name="search" />
        <Stack.Screen name="forgotPassword" />
        <Stack.Screen name="resetPassword" />
        <Stack.Screen name="updateProfile" />
        <Stack.Screen name="changePassword" />
      </Stack>
  );
}
