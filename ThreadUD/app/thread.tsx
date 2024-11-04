// app/ThreadScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { User } from "../api/getUser.js";

const ThreadScreen = () => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    console.log("Loading items...");
    const filters = {
      userName: "Dave",
    };
    const fetchedUser = await User(filters);
    console.log("Fetched items: ", fetchedUser);
    setUser(fetchedUser);
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
      <Text>Thread Screen</Text>
    </View>
  );
};

export default ThreadScreen;
