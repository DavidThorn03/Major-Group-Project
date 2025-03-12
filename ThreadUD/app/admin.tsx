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

const SERVER_URL = IP;

interface Post {
  _id: string;
  content: string;
  author: string;
}

interface Comment {
  _id: string;
  content: string;
  author: string;
}

const AdminScreen: React.FC = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<Post[]>([]);
  const [flaggedComments, setFlaggedComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFlaggedPosts = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/posts/flagged`);
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

  const fetchFlaggedComments = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/comments/flagged`);
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      setFlaggedComments(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to fetch flagged comments.");
    }
  };

  const loadFlaggedItems = async () => {
    setLoading(true);
    await Promise.all([fetchFlaggedPosts(), fetchFlaggedComments()]);
    setLoading(false);
  };

  useEffect(() => {
    loadFlaggedItems();
  }, []);

  const handleApprovePost = async (id: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/posts/${id}/unflag`, {
        method: "PUT",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      // Remove approved post from state
      setFlaggedPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to approve post.");
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      // Remove deleted post from state
      setFlaggedPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to delete post.");
    }
  };

  const handleApproveComment = async (id: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/comments/${id}/unflag`, {
        method: "PUT",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      // Remove approved comment from state
      setFlaggedComments((prev) =>
        prev.filter((comment) => comment._id !== id)
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to approve comment.");
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/comments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      // Remove deleted comment from state
      setFlaggedComments((prev) =>
        prev.filter((comment) => comment._id !== id)
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to delete comment.");
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

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemContent}>{item.content}</Text>
      <View style={styles.buttonRow}>
        <Button
          title="Approve"
          onPress={() => handleApproveComment(item._id)}
        />
        <Button title="Delete" onPress={() => handleDeleteComment(item._id)} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading flagged items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      <Text style={styles.header}>Flagged Comments</Text>
      {flaggedComments.length === 0 ? (
        <Text style={styles.emptyText}>No flagged comments found.</Text>
      ) : (
        <FlatList
          data={flaggedComments}
          keyExtractor={(item) => item._id}
          renderItem={renderCommentItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

export default AdminScreen;
