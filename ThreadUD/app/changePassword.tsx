import React, { useState, useEffect } from "react";
import { Alert, Text } from "react-native";
import { Container, Header, Input, Button } from "./components/RegisterStyles";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { checkPassword } from "./services/checkPassword";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


const ChangePasswordScreen = () => {
  const router = useRouter();
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
        router.replace({pathname: "/resetPassword", params: { email }});
      } catch (error) {
        console.error("Error comparing passwords:", error);
      }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    
    <Container>
      <Header>Change Password</Header>
      <Text>Enter your old password</Text>
      <Input 
          placeholder="Password" 
          secureTextEntry 
          returnKeyType="done"
          onSubmitEditing={check} 
          onChangeText={setPassword} 
        />
      <Button onPress={check} title="Confirm password"/>
    </Container>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
