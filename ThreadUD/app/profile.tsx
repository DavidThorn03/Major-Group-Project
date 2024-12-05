import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import {
  Container,
  Header,
  PostCard,
  ThreadName,
  GeneralText,
  Button,
} from "./components/StyledWrappers";
import { NavigatorContext } from "expo-router/build/views/Navigator.js";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
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

  const logOut = async () => {
    await AsyncStorage.removeItem("User");
    setUser(null);
    navigation.navigate("index");
  }
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
      <Button
        title="Log Out"
        onPress={logOut}
        style={{ marginTop: 8 }}
      />
    </View>
  );
};

export default ProfileScreen;