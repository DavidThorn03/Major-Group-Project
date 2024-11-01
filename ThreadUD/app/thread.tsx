// app/ThreadScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { test } from "../api/api.js";

const ThreadScreen = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    console.log("Loading items...");
    const fetchedItems = await test();
    console.log("Fetched items: ", fetchedItems);
    setItems(fetchedItems);
  };
  if (items == null) {
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
