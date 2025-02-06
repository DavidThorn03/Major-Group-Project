import { Stack } from "expo-router";
import { UserProvider } from "./context/UserContext"; // Import UserProvider

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
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
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="post" />
      </Stack>
    </UserProvider>
  );
}
