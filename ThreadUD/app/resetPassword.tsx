import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Container,
  Header,
  Input,
  Button,
  GeneralText,
  InstructionText,
} from "./components/ResetPassStyles";
import { changePassword } from "./services/changePassword.js";
import { SafeAreaView } from "react-native-safe-area-context";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const router = useRouter();
  const email = useLocalSearchParams();

  const reset = async () => {
    if (!email) {
      Alert.alert("Error", "Email information is missing");
      router.push("/forgotPassword");
      return;
    }

    if (password.length < 9) {
      Alert.alert("Error", "Password must be at least 9 characters long!");
      return;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!regex.test(password)) {
      Alert.alert(
        "Error",
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character!"
      );
      return;
    }

    if (password !== confirmPass) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      const result = await changePassword({ email, password: password });
      if (result) {
        Alert.alert("Success", "Password changed successfully");
      }
      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    <Container>
      <Header>Reset Password</Header>

      <GeneralText>Enter your new password below</GeneralText>

      <InstructionText>New Password</InstructionText>
      <Input
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholder="Enter your new password"
        autoFocus={true}
      />

      <InstructionText>Confirm Password</InstructionText>
      <Input
        onChangeText={setConfirmPass}
        value={confirmPass}
        secureTextEntry
        placeholder="Confirm your new password"
      />

      <Button onPress={reset} title="Reset Password" style="" />

      <GeneralText style="text-xs">
        Password must be at least 9 characters and include uppercase, lowercase,
        number, and special character.
      </GeneralText>
    </Container>
    </SafeAreaView>
  );
};

export default ResetPassword;
