import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { User } from "../services/getUser.js";

const ThreadScreen = () => {
  const [user, setUser] = useState([]);
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
