import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { User } from "./services/getUser";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useNavigation } from "@react-navigation/native";
import GeneralStyles from "./styles/GeneralStyles"; 
import LoginStyles from "./styles/LoginStyles";

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
      const fetchedUser = await User(filters); 
      if (!fetchedUser) {
        Alert.alert("Failure", "Incorrect email or password");
        console.log("No user found");
      } else {
        Alert.alert("Success", "Logged in successfully!");
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
      <View style={LoginStyles.buttonContainer}>
      <Text style={GeneralStyles.text}>Don't have an account?</Text>
      <Button title="Register new user" onPress={() => navigation.navigate("register")}/>
        </View>
    </View>
  );
};

export default LoginScreen;
