import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { getUser } from "./services/getUser";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "./context/UserContext"; // Use useUser hook
import GeneralStyles from "./styles/GeneralStyles";
import LoginStyles from "./styles/LoginStyles";
import { GeneralText } from "./components/StyledWrappers.js";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { updateUser } = useUser(); // Use context to update user globally
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
      } else {
        Alert.alert("Success", "Logged in successfully!");
        console.log("User logged in:", fetchedUser);

        // Store user in AsyncStorage
        await AsyncStorage.setItem("User", fetchedUser);

        navigation.navigate("index");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <View style={GeneralStyles.container}>
      <Text style={GeneralStyles.header}>Log in</Text>
      <TextInput
        style={LoginStyles.input}
        placeholder="Email"
        onChangeText={(Email) => setEmail(Email.toLowerCase())}
      />
      <TextInput
        style={LoginStyles.input}
        placeholder="Password"
        onChangeText={(Password) => setPassword(Password)}
        secureTextEntry={true}
      />
      <View style={LoginStyles.buttonContainer}>
        <Button title="Log in" onPress={handleLogin} />
      </View>
      <View style={LoginStyles.buttonContainer}>
        <Text style={GeneralStyles.text}>Don't have an account?</Text>
        <Button
          title="Register new user"
          onPress={() => navigation.navigate("register")}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("forgotPassword")}
        style={LoginStyles.forgotPassword}
      ><GeneralText>Forgot Password?</GeneralText>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
