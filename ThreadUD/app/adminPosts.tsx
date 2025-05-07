import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import IP from "../config/IPAddress.js";
import AdminNav from "./components/AdminNav";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVER_URL = IP;

interface Post {
  _id: string;
  content: string;
  author: string;
}

const AdminPostsScreen: React.FC = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFlaggedPosts = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/post/flagged`);
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      setFlaggedPosts(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to fetch flagged posts.");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFlaggedPosts().finally(() => setLoading(false));
  }, []);

  const handleApprovePost = async (id: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/post/${id}/unflag`, {
        method: "PUT",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      setFlaggedPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to approve post.");
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/post/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      setFlaggedPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to delete post.");
    }
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemContent}>{item.content}</Text>
      <View style={styles.buttonRow}>
        <Button title="Approve" onPress={() => handleApprovePost(item._id)} />
        <Button title="Delete" onPress={() => handleDeletePost(item._id)} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading flagged posts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    <View style={styles.container}>
      <AdminNav currentScreen="adminPosts" />
      <Text style={styles.header}>Flagged Posts</Text>
      {flaggedPosts.length === 0 ? (
        <Text style={styles.emptyText}>No flagged posts found.</Text>
      ) : (
        <FlatList
          data={flaggedPosts}
          keyExtractor={(item) => item._id}
          renderItem={renderPostItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  itemContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  emptyText: {
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 10,
  },
});

export default AdminPostsScreen;
