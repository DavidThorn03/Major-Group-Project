import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { Container, GeneralText } from "./components/LoginStyles";
import { confirmRegister } from "./services/confirmRegister.js";	
import { registerStudent } from "./services/registerStudent.js";
import { useRouter, useLocalSearchParams } from "expo-router";

const VerifyRegister = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const user = useLocalSearchParams();

  useEffect(() => {
        sendEmail();
  }, []);

  const sendEmail = async () => {
    const code = Math.floor(1000 + Math.random() * 9000);
    console.log("Generated code:", code);
    setCode(code);

    console.log("Sending email...");
    console.log(code);

    try {
    const filter = { email: user.email, code: code };
    const result = confirmRegister(filter);
    console.log("Email sent to:", text.toLowerCase());
    } catch (error) {
    console.error("Error sending email:", error);
    }
    setText("");
    };

  const verify = async () => {
    if (parseInt(text) === code) {
      console.log("Code verified!");
      const response = await registerStudent(user);
      if (response && response.user) {
        Alert.alert("Success", "Account created successfully!");
        await AsyncStorage.setItem("User", response.user);
        router.replace("/");
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } else {
      Alert.alert("Error", "Incorrect code. Please try again.");
    }
  };

  return (
    <Container>
        <GeneralText>Email sent to {email}</GeneralText>
        <GeneralText>Enter code to confirm your email</GeneralText>
        <TextInput
            onChangeText={setText}
            value={text}
            keyboardType="numeric"
            placeholder="Enter your code"
            autoFocus={true}
        />
        <Button title="Verify" onPress={verify} />
        <GeneralText>Didnt recieve email?</GeneralText>
        <Button title="Resend email" onPress={() => sendEmail(email)} />
    </Container>
  );
};

export default VerifyRegister;
