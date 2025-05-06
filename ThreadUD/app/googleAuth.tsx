import React, { useState, useEffect } from "react";
import { Alert, Text } from "react-native";
import { Container, Header, Input, Button } from "./components/RegisterStyles";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { authCheck } from "./services/authCheck.js";
import { useRouter, useLocalSearchParams } from "expo-router";


const GoogleAuthScreen = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { user } = useLocalSearchParams();

  const check = async () => {
    if (!code || code.length != 6) {
      Alert.alert("Error", "Please enter your code.");
      return;
    }
    try {
        const response = await authCheck({code: code});
        console.log("Response:", response.result);
        if (!response.result) {
          Alert.alert("Error", "Invalid code.");
          return;
        }
        Alert.alert("Success", "Logged in successfully!");
        await AsyncStorage.setItem("User", user);
        router.replace("/");
      } catch (error) {
        console.error("Error verifying:", error);
      }
  };


  return (
    <Container>
      <Header>Google Authentication</Header>
      <Text>Enter your authentication code</Text>
      <Input placeholder="code" keyboardType="numeric" onChangeText={setCode} />
      <Button onPress={check} title="Enter Code"/>
    </Container>
  );
};

export default GoogleAuthScreen;
