import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { User } from "../api/getUser.js";
import * as AsyncStorage from "../util/AsyncStorage.js"
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const navigate = useNavigation();
    const user = AsyncStorage.getItem("User");
    console.log("User from storage: ", user);
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

export default ProfileScreen;
