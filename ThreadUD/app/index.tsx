import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { set } from "mongoose";


const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const isLiked = false;
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://192.168.0.11:5000/api/posts");
        setPosts(response.data)
        console.log("Posts: ", response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
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

  const renderPost = ({ item }) => {
    if(user != null){
      //if(item.likes.includes(user._id)) isLiked = true;
    }
    return (
    <View style={styles.postCard}>
      <Text style={styles.threadName}>Thread: {item.threadName}</Text>
      <Text style={styles.author}>Posted by: {item.author}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text>Likes = {item.likes}</Text>
    </View>
  )};
  if (posts.length === 0) {
    return <Text>Loading posts...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ThreadUD - Home</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
      />
      <View style={styles.buttonContainer}>
        <Button title="Log In" onPress={() => navigation.navigate("login")} />
          <Button title="Sign Up" onPress={() => navigation.navigate("register")} />
          <Button title="Profile" onPress={() => navigation.navigate("profile")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  postCard: {
    backgroundColor: "#68BBE3",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  threadName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: "center",
  },
});

export default HomeScreen;
