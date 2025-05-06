import React, { useState, useEffect } from "react";
import { Alert, View, ScrollView } from "react-native";
import {
  Container,
  Header,
  HeaderText,
  UserInfo,
  UserInfoItem,
  Button,
  TwoFactorAuthContainer,
  AuthSetupContainer,
  AuthText,
  AuthQRImage,
  AuthCodeText,
  SubtitleText,
  ButtonGroupContainer,
  ButtonRow,
  ChangePasswordContainer,
} from "./components/UpdateProfileStyles";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { updateProfile } from "./services/updateProfile";
import BottomNavBar from "./components/BottomNavBar";
import { useRouter } from "expo-router";

const UpdateProfileScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [auth, setAuth] = useState(false);
  const [oldUser, setOldUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        if (userData) {
          const user = userData;
          setName(user.userName);
          setYear(user.year.toString());
          setCourse(user.course);
          setAuth(user.auth);
          setOldUser(user);
          console.log("User data:", userData);
        } else {
          console.log("No user data found");
          router.push("/login");
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

    if (
      name.trim() == oldUser.userName &&
      year == oldUser.year &&
      course.trim().toUpperCase() == oldUser.course &&
      auth == oldUser.auth
    ) {
      Alert.alert("Error", "Profile info is unchanged, please try again.");
      return;
    }

    if (year < 1 || year > 4) {
      Alert.alert("Error", "Year must be between 1 and 4!");
      return;
    }

    var regex = /^TU\d{3}$/;
    if (!regex.test(course.trim().toUpperCase())) {
      Alert.alert(
        "Error",
        "Course must start with 'TU' followed by exactly 3 numbers (e.g., TU123)"
      );
      return;
    }

    try {
      var newUser = {};
      if (!(name.trim() == "" && name != oldUser.userName)) {
        newUser.userName = name.trim();
      }
      if (!(year == "" && year != oldUser.year)) {
        newUser.year = year;
      }
      if (!(course.trim() == "" && course != oldUser.course)) {
        newUser.course = course.trim().toUpperCase();
      }
      if (auth != oldUser.auth) {
        newUser.auth = auth;
      }
      const filter = { email: oldUser.email, update: newUser };
      const response = await updateProfile(filter);
      console.log("Response from backend:", response);

      if (response) {
        Alert.alert("Success", "Account updated successfully!");
        await AsyncStorage.setItem("User", response);
        router.replace("/profile");
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
      <Header>
        <HeaderText>Update Profile</HeaderText>
      </Header>
      <ScrollView style={{ flex: 1, marginTop: 68 }}>
        <SubtitleText>Update Your Name, Year, Course Code and 2FA</SubtitleText>
        <UserInfo>
          <UserInfoItem
            label="Name"
            value={name}
            onChangeText={setName}
            editable={true}
          />
          <UserInfoItem
            label="Email"
            value={oldUser ? oldUser.email : "Email"}
            editable={false}
          />
          <UserInfoItem
            label="Year"
            value={year}
            onChangeText={setYear}
            editable={true}
          />
          <UserInfoItem
            label="Course"
            value={course}
            onChangeText={setCourse}
            editable={true}
          />
          <TwoFactorAuthContainer auth={auth} setAuth={setAuth} />
        </UserInfo>

        {auth && !oldUser?.auth && (
          <AuthSetupContainer>
            <AuthText>Set up google Authentication</AuthText>
            <AuthText>1. Go to Google Authenticator app</AuthText>
            <AuthText>2. Click the '+' button</AuthText>
            <AuthText>3. Click 'Scan QRcode' and scan the code below:</AuthText>
            <AuthQRImage />
            <AuthCodeText style={{ fontWeight: "bold", paddingVertical: 25 }}>
              OR
            </AuthCodeText>
            <AuthText>3. Enter the code below:</AuthText>
            <AuthCodeText>LJXUSZ2XHBTWQZJ4H56TYNJDJA5FOQC6</AuthCodeText>
          </AuthSetupContainer>
        )}

        <ButtonGroupContainer>
          <ButtonRow>
            <Button
              onPress={update}
              title="Save"
              style={{ flex: 1, marginRight: 10 }}
            />
            <Button
              onPress={() => router.replace("/profile")}
              title="Cancel"
              style={{ flex: 1, marginLeft: 10 }}
            />
          </ButtonRow>
        </ButtonGroupContainer>
        <ChangePasswordContainer>
          <Button
            onPress={() => router.replace("/changePassword")}
            title="Change Password"
          />
        </ChangePasswordContainer>
      </ScrollView>
      <BottomNavBar />
    </Container>
  );
};

export default UpdateProfileScreen;
