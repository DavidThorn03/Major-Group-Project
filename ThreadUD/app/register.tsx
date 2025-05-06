import React, { useState } from "react";
import { Alert, Switch, View, Text, Image } from "react-native";
import {
  Container,
  Header,
  Input,
  Button,
  AuthSwitchContainer,
  AuthSwitch,
  AuthInstructions,
  AuthStep,
  AuthDivider,
  AuthQRCode,
  AuthCode,
} from "./components/RegisterStyles";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [auth, setAuth] = useState(false);

  const handleRegister = async () => {
    console.log("Registering...", name, email, password, year, course);
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPass.trim() === "" ||
      year.trim() === "" ||
      course.trim() === ""
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if (password.trim().length < 9) {
      Alert.alert("Error", "Password must be at least 9 characters long!");
      return;
    }
    var regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!regex.test(password)) {
      Alert.alert(
        "Error",
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character!"
      );
      return;
    }
    if (password.trim() != confirmPass) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    if (parseInt(year) < 1 || parseInt(year) > 4) {
      Alert.alert("Error", "Year must be between 1 and 4!");
      return;
    }
    setCourse(course.toUpperCase());
    regex = /^TU\d{3}$/;
    if (!regex.test(course.trim().toUpperCase())) {
      Alert.alert(
        "Error",
        "Course must start with 'TU' followed by exactly 3 numbers (e.g., TU123)"
      );
      return;
    }
    try {
      const userData = {
        userName: name.trim(),
        email: email.toLowerCase().trim(),
        password: password.trim(),
        year: parseInt(year, 10),
        course: course.toUpperCase().trim(),
        auth: auth,
      };
      router.push({pathname: "/verifyRegister", params: { user: userData }});
    } catch (error: any) {
      console.error("Error during registration:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    <Container>
      <Header>Create an Account</Header>
      <Input placeholder="Full Name" onChangeText={setName} />
      <Input
        placeholder="Email Address"
        keyboardType="email-address"
        onChangeText={(email: string) => setEmail(email.toLowerCase())}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Input
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPass}
      />
      <Input
        placeholder="Year of Study"
        keyboardType="numeric"
        onChangeText={setYear}
      />
      <Input placeholder="Course Code" onChangeText={setCourse} />
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Enable Google Authentication
      </Text>
      <AuthSwitchContainer>
        <AuthSwitch value={auth} onValueChange={() => setAuth(!auth)} />
      </AuthSwitchContainer>
      {auth ? (
        <View>
          <AuthInstructions>Set up google Authentication</AuthInstructions>
          <AuthStep>1. Go to Google Authenticator app</AuthStep>
          <AuthStep>2. Click the '+' button</AuthStep>
          <AuthStep>3. Click 'Scan QRcode' and scan the code below:</AuthStep>
          <AuthQRCode />
          <AuthDivider />
          <AuthStep>3. Enter the code below:</AuthStep>
          <AuthCode code="LJXUSZ2XHBTWQZJ4H56TYNJDJA5FOQC6" />
        </View>
      ) : (
        <View style={{ marginBottom: 24 }} />
      )}
      <Button onPress={handleRegister} title="Continue" style="" />
    </Container>
    </SafeAreaView>
  );
};

export default RegisterPage;
