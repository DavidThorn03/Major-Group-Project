import React, { useState } from "react";
import { Text, Alert } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { getUser } from "./services/getUser";
import { useNavigation } from "@react-navigation/native";
import {
  Container,
  Header,
  Input,
  ButtonContainer,
  Button,
  GeneralText,
  ForgotPasswordButton,
} from "./components/LoginStyles";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Loading user...");
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

      Alert.alert("Success", "Logged in successfully!");
      console.log("User logged in:", fetchedUser);

      // Store user in AsyncStorage (your util automatically stringifies)
      await AsyncStorage.setItem("User", fetchedUser);

      // Navigate to the main screen (or index)
      if (fetchedUser.admin) {
        navigation.navigate("adminPosts");
      } else {
        navigation.navigate("index");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Something went wrong during login.");
    }
  };

  return (
    <Container>
      <Header>Log in</Header>
      <Input
        placeholder="Email"
        onChangeText={(text) => setEmail(text.toLowerCase())}
      />
      <Input
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <ButtonContainer>
        <Button title="Log in" onPress={handleLogin} />
      </ButtonContainer>
      <ButtonContainer>
        <GeneralText>Don't have an account?</GeneralText>
        <Button
          title="Register new user"
          onPress={() => navigation.navigate("register")}
        />
      </ButtonContainer>
      <ForgotPasswordButton
        onPress={() => navigation.navigate("forgotPassword")}
      >
        <GeneralText style={{ color: "#3b82f6" }}>Forgot Password?</GeneralText>
      </ForgotPasswordButton>
    </Container>
  );
};

export default LoginScreen;
