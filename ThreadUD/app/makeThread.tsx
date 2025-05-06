import React, { useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import IP from "../config/IPAddress.js";
import {
  Container,
  Header,
  HeaderText,
  Input,
  Button,
  SubtitleText,
} from "./components/MakeThreadStyles";
import BottomNavBar from "./components/BottomNavBar";
import NavBar from "./components/NavBar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


const MakeThreadPage = () => {
  const router = useRouter();
  const [threadName, setThreadName] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");

  const handleCreateThread = async () => {
    if (!threadName || threadName.trim().length == 0 || !year || !course) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if (threadName.length > 24) {
      Alert.alert("Error", "Thread name cannot exceed 24 characters!");
      return;
    }
    if (year < 1 || year > 4) {
      Alert.alert("Error", "Year must be between 1 and 4!");
      return;
    }
    setCourse(course.toUpperCase());
    const regex = /^TU\d{3}$/;

    if (!regex.test(course.toUpperCase())) {
      Alert.alert(
        "Error",
        "Course must start with 'TU' followed by exactly 3 numbers (e.g., TU123)"
      );
      return;
    }

    try {
      const response = await axios.post(`${IP}/thread`, {
        threadName,
        year: parseInt(year, 10),
        course: course.toUpperCase(),
      });

      if (response.status === 201) {
        Alert.alert("Success", "Thread created successfully!");
        router.replace("/");
      } else {
        Alert.alert("Error", "Failed to create thread.");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
      Alert.alert("Error", "An error occurred while creating the thread.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    <Container>
      <Header>
        <HeaderText>Create a New Thread</HeaderText>
      </Header>
      <SubtitleText>Please use the same name as the module name</SubtitleText>
      <Input
        placeholder="Thread Name (max 24 chars)"
        onChangeText={setThreadName}
        value={threadName}
        maxLength={24}
      />
      <Input
        placeholder="Year of Study"
        keyboardType="numeric"
        onChangeText={setYear}
        value={year}
      />
      <Input
        placeholder="Course (TU###)"
        onChangeText={setCourse}
        value={course}
        maxLength={5}
      />
      <Button onPress={handleCreateThread} title="Create Thread" />
      <BottomNavBar />
    </Container>
    </SafeAreaView>
  );
};

export default MakeThreadPage;
