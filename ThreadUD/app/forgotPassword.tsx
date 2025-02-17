import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useNavigation } from "@react-navigation/native";
import GeneralStyles from "./styles/GeneralStyles";
import LoginStyles from "./styles/LoginStyles";
import { Container, GeneralText } from "./components/StyledWrappers.js";
import {forgotPassword} from "./services/forgotPassword.js";
import Icon from 'react-native-vector-icons/AntDesign';


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");  
  const [code, setCode] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const generateCode = async () => {
      const code = Math.floor(1000 + Math.random() * 9000);
      console.log("Generated code:", code);
      setCode(code);
    }
    generateCode();
  }, []);

  const sendEmail = async (text) => {
    console.log("Sending email...");
    console.log(code)

    try {
      const filter = { email: text.toLowerCase(), code: code };
      const result = forgotPassword(filter);
      console.log("Email sent to:", text.toLowerCase());
    } catch (error) {
      console.error("Error sending email:", error);
    }
    setText("");
    setEmail(text.toLowerCase());
  }

  const verify = async () => {
    if (parseInt(text) === code) {
      console.log("Code verified!");
      Alert.alert("Success", "Code verified. You can now reset your password.");
      navigation.navigate("resetPassword", { email });
    }
    else {
      Alert.alert("Error", "Incorrect code. Please try again.");
    }
  }

  return (
    
    <Container>
        <GeneralText>In progress</GeneralText>
    {!email &&
    <Container>
        <GeneralText>Enter your email to reset your password</GeneralText>
        <View style={{flexDirection: "row"}}>
            <TextInput 
                onChangeText={setText}
                value={text}
                placeholder="Enter your email"
                autoFocus={true}
            />
            <TouchableOpacity onPress={() => sendEmail(text)}>
                <Icon name="enter" size={25}/>
            </TouchableOpacity>
        </View>
    </Container>
    }
    {email &&
    <Container>
    <GeneralText>Email sent to {email}</GeneralText>
    <GeneralText>Enter code to reset your password</GeneralText>
    <View style={{flexDirection: "row"}}>
        <TextInput 
            onChangeText={setText}
            value={text}
            placeholder="Enter your code"
            autoFocus={true}
        />
        <TouchableOpacity onPress={() => verify()}>
            <Icon name="enter" size={25}/>
        </TouchableOpacity>
    </View>
    <GeneralText>Didnt recieve email?</GeneralText>
    <Button title="Resend email" onPress={() => sendEmail(email)}/>
</Container>
    }
    </Container>
  );
};

export default ForgotPassword;
