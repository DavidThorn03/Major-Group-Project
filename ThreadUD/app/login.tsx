import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { User } from "./services/getUser"; // Corrected import path and function name
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useNavigation } from "@react-navigation/native";
import GeneralStyles from "./styles/GeneralStyles"; // Importing general styles (same directory as login.tsx)
import LoginStyles from "./styles/LoginStyles"; // Importing specific styles for the login page

const LoginScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Loading user...");
    const filters = {
      email: Email,
      password: Password,
    };

    try {
      const fetchedUser = await User(filters); // Using getUser function as intended
      if (!fetchedUser) {
        console.log("No user found");
      } else {
        await AsyncStorage.setItem("User", fetchedUser);
        setUser(fetchedUser);
        await navigation.navigate("index");
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
    </View>
  );
};

export default LoginScreen;
