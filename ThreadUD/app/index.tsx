import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://192.168.1.8:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.threadName}>Thread: {item.threadName}</Text>
      <Text style={styles.author}>Posted by: {item.author}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
    </View>
  );

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
