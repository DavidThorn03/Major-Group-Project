import React, { useState, useEffect } from "react";
import { Alert, Text } from "react-native";
import { Container, Header, Input, Button } from "./components/RegisterStyles";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useNavigation } from "@react-navigation/native";
import { updateProfile } from "./services/updateProfile";


const UpdateProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [oldUser, setOldUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        if (userData) {
            const user = userData;
            setName(user.userName);
            setYear(user.year);
            setCourse(user.course);
            setOldUser(user);
          console.log("User data:", userData);
        } else {
          console.log("No user data found");
          setName("");
          setYear("");
          setCourse("");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const update = async () => {
    console.log("Updating user");
    if (!name && !year && !course) {
      Alert.alert("Error", "Please fill out at least one field.");
      return;
    }
    
    if (name === oldUser.userName && year === oldUser.year && course === oldUser.course) {
      Alert.alert("Error", "Profile info is unchanged, please try again.");
      return;
    }
    
    try {
      var newUser = {}
      if(!(name == "" && name != oldUser.userName)) {
        newUser.userName = name;
      }
      if(!(year == "" && year != oldUser.year)) {
        newUser.year = year;
      }
      if(!(course == "" && course != oldUser.course)) {
        newUser.course = course;
      }
      const filter = { email: oldUser.email, update: newUser };
      const response = await updateProfile(filter);
      console.log("Response from backend:", response);

      if (response) {
        Alert.alert("Success", "Account updated successfully!");
        await AsyncStorage.setItem("User", response);
        navigation.navigate("profile");
      } else {
        Alert.alert("Error", "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during update:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update. Please try again."
      );
    }
  };

  return (
    <Container>
      <Header>Update Profile</Header>
      <Text>Name</Text>
      <Input placeholder={oldUser ? oldUser.userName : "Name"} onChangeText={setName} />
      <Text>Email</Text>
      <Text>{oldUser ? oldUser.email : "Email"}</Text>
        <Text>Year</Text>
      <Input placeholder={oldUser ? oldUser.year.toString() : "Year"} keyboardType="numeric" onChangeText={setYear} />
      <Text>Course</Text>
      <Input placeholder={oldUser ? oldUser.course : "Course"} onChangeText={setCourse} />
      <Button onPress={update} title="Continue" />
      <Button onPress={() => navigation.navigate("profile")} title="Cancel" />
      <Button onPress={() => navigation.navigate("changePassword")} title="Change Password" />
    </Container>
  );
};

export default UpdateProfileScreen;
