import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { User } from "../api/getUser.js";
import * as AsyncStorage from "../util/AsyncStorage.js"
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const getUser = async () => {
    console.log("Loading items...");
    const filters = {
      userName: UserName,
      password: Password
    };
    const fetchedUser = await User(filters);
    if(fetchedUser == null) {
        console.log("No user found");
    }
    else{
        
        await AsyncStorage.setItem("User", fetchedUser);
        setUser(fetchedUser);
        const userFromStor = await AsyncStorage.getItem("User");
        //console.log("User from storage: ", userFromStor);
        await navigation.navigate("profile");
    }
  };
  return (
    <View>
      <Text>Log in</Text>
      <TextInput placeholder="Username" onChangeText = {UserName =>setUserName(UserName.toLowerCase())}/>
      <TextInput placeholder="Password" onChangeText = {Password =>setPassword(Password)} secureTextEntry={true}/>
      <Button title="Log in" onPress={getUser} />
    </View>
  );
};

export default LoginScreen;
