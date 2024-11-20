import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";

const ProfileScreen = () => {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchUserFromStorage = async () => {
      const storedUser = await AsyncStorage.getItem("User");
      if (storedUser) {
        setUser(storedUser); 
        console.log("User from storage: ", storedUser);
      }
    };

    fetchUserFromStorage();
  }, []); 
  if (!user) {
    return <Text>Loading user...</Text>;
  }
  return (
    <View>
      <Text>Profile</Text>
      <Text>User Name: {user.userName}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Course: {user.course}</Text>
      <Text>Year: {user.year}</Text>
    </View>
  );
};

export default ProfileScreen;