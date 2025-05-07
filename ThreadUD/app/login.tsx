import React, { useState } from "react";
import { Alert, Image, View } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { getUser } from "./services/getUser";
import { useRouter } from "expo-router";
import {
  Container,
  Header,
  Input,
  ButtonContainer,
  Button,
  GeneralText,
  ForgotPasswordButton,
} from "./components/LoginStyles";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const router = useRouter();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Loading user...");

    if (Email.trim() === "" || Password.trim() === "") {
      Alert.alert("Error", "Email and password are required!");
      return;
    }

    const filters = {
      email: Email,
      password: Password,
    };

    try {
      const fetchedUser = await getUser(filters);
      if (!fetchedUser) {
        Alert.alert("Failure", "Incorrect email or password");
        console.log("No user found");
        return;
      }

      // Validate the user object shape
      if (!fetchedUser.email || !Array.isArray(fetchedUser.threads)) {
        Alert.alert("Failure", "Malformed user data received.");
        console.error("Malformed user data:", fetchedUser);
        return;
      }

      if (fetchedUser.auth) {
        router.push({
          pathname: "/googleAuth",
          params: { user: JSON.stringify(fetchedUser) },
        });
        return;
      }

      Alert.alert("Success", "Logged in successfully!");
      console.log("User logged in:", fetchedUser);

      // Store user in AsyncStorage (your util automatically stringifies)
      await AsyncStorage.setItem("User", fetchedUser);

      // Navigate to the main screen (or index)
      if (fetchedUser.admin) {
        router.replace("/adminPosts");
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Something went wrong during login.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    <Container>
      <Header>Log in to ThreadUD</Header>
      <View style={{ marginTop: 10 }}>
        <Input
          placeholder="Email Address"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button onPress={handleLogin} title="Log in" style="" />
      <ForgotPasswordButton
        onPress={() => router.push("/forgotPassword")}
        style=""
      >
        <GeneralText style="text-red-400 underline">
          Forgot Password?
        </GeneralText>
      </ForgotPasswordButton>
      <View style={{ marginTop: 40 }}>
        <GeneralText style="">Don't have an account?</GeneralText>
        <Button
          title="Register new user"
          onPress={() => router.push("/register")}
          style=""
        />
      </View>
    </Container>
    </SafeAreaView>
  );
};

export default LoginScreen;
