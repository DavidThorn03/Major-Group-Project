import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import RegisterStyles from "./styles/RegisterStyles";
import { registerStudent } from "./services/registerStudent";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useNavigation } from "@react-navigation/native";


const RegisterPage = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");

  const handleRegister = async () => {
    console.log("Registering...", name, email, password, year, course);
    if (!name || !email || !password || !year || !course) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    try {
      const studentData = {
        userName : name,
        email : email,
        password  : password,
        year: parseInt(year),
        course  : course,
      };
      const response = await registerStudent(studentData);
      Alert.alert("Success", "Account created successfully!");
      await AsyncStorage.setItem("User", studentData);
      await navigation.navigate("index");
      // Optionally navigate to the login page
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <View style={RegisterStyles.container}>
      <Text style={RegisterStyles.header}>Create an Account</Text>
      <TextInput
        style={RegisterStyles.input}
        placeholder="Name"
        onChangeText={setName}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(email) => setEmail(email.toLowerCase())}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Year"
        keyboardType="numeric"
        onChangeText={setYear}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Course"
        onChangeText={setCourse}
      />
      <TouchableOpacity style={RegisterStyles.button} onPress={handleRegister}>
        <Text style={RegisterStyles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterPage;
