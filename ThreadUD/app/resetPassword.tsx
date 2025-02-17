import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { useRoute,useNavigation } from "@react-navigation/native";
import GeneralStyles from "./styles/GeneralStyles";
import LoginStyles from "./styles/LoginStyles";
import { Container, GeneralText } from "./components/StyledWrappers.js";
import Icon from 'react-native-vector-icons/AntDesign';
import { changePassword } from "./services/changePassword.js";


const ResetPassord = () => {
  const [text, setText] = useState("");  
  const route = useRoute();
  const { email } = route.params || {};
  const navigator = useNavigation();

  const reset = async () => {
    try{
      const result = await changePassword({email, password: text});
      if(result){
        Alert.alert("Success", "Password changed successfully");
      }
      navigator.navigate("login");
    }catch(err){
      Alert.alert("Error", err.message);
    }
  };

  return (
    <Container>
        <GeneralText>Enter your new password</GeneralText>
    <View style={{flexDirection: "row"}}>
        <TextInput 
            onChangeText={setText}
            value={text}
            placeholder="Enter your code"
            autoFocus={true}
        />
        <TouchableOpacity onPress={() => reset()}>
            <Icon name="enter" size={25}/>
        </TouchableOpacity>
    </View>
    </Container>
  );
};

export default ResetPassord;
