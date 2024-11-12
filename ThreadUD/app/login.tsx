import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { User } from "../api/getUser.js";

const LoginScreen = () => {
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
    /*if(fetchedUser == null) {
      console.log("Print incorrect password or username method");
      getUser();
    }*/
    //else {
        console.log("Fetched items: ", JSON.stringify(fetchedUser, undefined, 4));
        const userArray = JSON.parse(fetchedUser);
        //save to local storage
        setUser(fetchedUser);
    //}
    //redirect to home page
  };
  if (user == null) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
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
