import React, { useState } from "react";
import { Alert, Switch, View, Text, Image } from "react-native";
import { Container, Header, Input, Button } from "./components/RegisterStyles";
import { registerStudent } from "./services/registerStudent";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useNavigation } from "@react-navigation/native";

const RegisterPage = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [auth, setAuth] = useState(false);

  const handleRegister = async () => {
    console.log("Registering...", name, email, password, year, course);
    if (!name || !email || !password || !year || !course) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if(password.length < 9) {
      Alert.alert("Error", "Password must be at least 9 characters long!");
      return;
    }
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!regex.test(password)) {
      Alert.alert("Error", "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character!");
      return;
    }
    if (password != confirmPass){
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    if(year < 1 || year > 4) {
      Alert.alert("Error", "Year must be between 1 and 5!");
      return;
    }
    var regex = /^[A-Za-z]{2}\d{3}$/;
    if (!regex.test(course)) {
      Alert.alert("Error", "Course must be in the format LLDDD where L is a letter and D is a digit!");
      return
    }
    try {
      const userData = {
        userName: name.trim(),
        email: email.toLowerCase(),
        password: password.trim(),
        year: parseInt(year, 10),
        course: course.toUpperCase(),
        auth: auth
      };
      navigation.navigate("verifyRegister", { user: userData });
      /*
      console.log("User data being sent:", userData);

      const response = await registerStudent(userData);
      console.log("Response from backend:", response);

      if (response && response.user) {
        Alert.alert("Success", "Account created successfully!");
        await AsyncStorage.setItem("User", response.user);
        navigation.navigate("index");
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
      */
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <Container>
      <Header>Create an Account</Header>
      <Input placeholder="Name" onChangeText={setName} />
      <Input
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(email) => setEmail(email.toLowerCase())}
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
      <Input placeholder="Year" keyboardType="numeric" onChangeText={setYear} />
      <Input placeholder="Course" onChangeText={setCourse} />
      <Text>Enable Google Authentication</Text>
      <View style={{ flexDirection: "row" }}>
      <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={auth ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => {setAuth(!auth)}}
          value={auth}
        />
      </View>
      {auth && (
      <View>
        <Text>Set up google Authentication</Text>
        <Text>1. Go to Google Authenticator app</Text>
        <Text>2. Click the '+' button</Text>
        <Text>3. Click 'Scan QRcode' and scan the code below:</Text>
        <Image source={require('../assets/images/AuthQR.png')} />
        <Text>OR</Text>
        <Text>3. Enter the code below:</Text>
        <Text>LJXUSZ2XHBTWQZJ4H56TYNJDJA5FOQC6</Text>
      </View>
      )}
      <Button onPress={handleRegister} title="Continue" />
    </Container>
  );
};

export default RegisterPage;
