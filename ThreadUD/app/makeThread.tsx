import React, { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
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

const MakeThreadPage = () => {
  const navigation = useNavigation();
  const [threadName, setThreadName] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");

  const handleCreateThread = async () => {
    if (!threadName || !year || !course) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if(year < 1 || year > 4) {
      Alert.alert("Error", "Year must be between 1 and 5!");
      return;
    }
    const regex = /^[A-Za-z]{2}\d{3}$/;
    if (!regex.test(course)) {
      Alert.alert("Error", "Course must be in the format LLDDD where L is a letter and D is a digit!");
      return
    }

    try {
      const response = await axios.post(`${IP}/thread`, {
        threadName,
        year: parseInt(year, 10),
        course: course.toUpperCase(),
      });

      if (response.status === 201) {
        Alert.alert("Success", "Thread created successfully!");
        navigation.navigate("index");
      } else {
        Alert.alert("Error", "Failed to create thread.");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
      Alert.alert("Error", "An error occurred while creating the thread.");
    }
  };

  return (
    <Container>
      <Header>
        <HeaderText>Create a New Thread</HeaderText>
      </Header>
      <SubtitleText>Please use the same name as the module name</SubtitleText>
      <Input
        placeholder="Thread Name"
        onChangeText={setThreadName}
        value={threadName}
      />
      <Input
        placeholder="Year of Study"
        keyboardType="numeric"
        onChangeText={setYear}
        value={year}
      />
      <Input placeholder="Course" onChangeText={setCourse} value={course} />
      <Button onPress={handleCreateThread} title="Create Thread" />
      <BottomNavBar />
    </Container>
  );
};

export default MakeThreadPage;
