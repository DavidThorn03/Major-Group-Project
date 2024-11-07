import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { User } from "../api/getUser.js";

const LoginScreen = () => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    console.log("Loading items...");
    const filters = {
      userName: "Dave",
      password: "pass"
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
    </View>
  );
};

export default LoginScreen;
