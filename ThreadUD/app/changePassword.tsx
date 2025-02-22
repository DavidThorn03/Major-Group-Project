import React, { useState, useEffect } from "react";
import { Alert, Text } from "react-native";
import { Container, Header, Input, Button } from "./components/RegisterStyles";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useNavigation } from "@react-navigation/native";
import { checkPassword } from "./services/checkPassword";


const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        if (userData) {
            setUser(userData);
            setEmail(userData.email);
          console.log("User data:", userData);
        } else {
          console.log("No user data found");
          setUser(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const check = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter your password.");
      return;
    }
    try {
        const response = await checkPassword({enteredPassword: password, password: user.password});
        if (!response.result) {
          Alert.alert("Error", "Incorrect password.");
          return;
        }
        navigation.navigate("resetPassword", { email });
      } catch (error) {
        console.error("Error comparing passwords:", error);
      }
  };


  return (
    <Container>
      <Header>Change Password</Header>
      <Text>Enter your old password</Text>
      <Input placeholder="Password" onChangeText={setPassword} />
      <Button onPress={check} title="Confirm password"/>
    </Container>
  );
};

export default ChangePasswordScreen;
