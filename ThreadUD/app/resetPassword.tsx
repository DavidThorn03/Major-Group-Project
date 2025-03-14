import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Container, GeneralText } from "./components/LoginStyles";
import Icon from "react-native-vector-icons/AntDesign";
import { changePassword } from "./services/changePassword.js";

const ResetPassord = () => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const route = useRoute();
  const { email } = route.params || {};
  const navigator = useNavigation();

  const reset = async () => {
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
    try {
      const result = await changePassword({ email, password: text });
      if (result) {
        Alert.alert("Success", "Password changed successfully");
      }
      navigator.navigate("login");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <Container>
      <GeneralText>Enter your new password</GeneralText>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Enter your code"
          autoFocus={true}
        />
        <TextInput
          onChangeText={confirmPass}
          value={confirmPass}
          secureTextEntry
          placeholder="Enter your code"
          autoFocus={true}
        />
        <TouchableOpacity onPress={() => reset()}>
          <Icon name="enter" size={25} />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default ResetPassord;
