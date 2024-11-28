import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import RegisterStyles from "./styles/RegisterStyles";
import { registerStudent } from "./services/registerStudent";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !year || !course) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const studentData = {
        name,
        email,
        password,
        year: parseInt(year),
        course,
      };
      const response = await registerStudent(studentData);
      Alert.alert("Success", "Account created successfully!");
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
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Year"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Course"
        value={course}
        onChangeText={setCourse}
      />
      <TouchableOpacity style={RegisterStyles.button} onPress={handleRegister}>
        <Text style={RegisterStyles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterPage;
