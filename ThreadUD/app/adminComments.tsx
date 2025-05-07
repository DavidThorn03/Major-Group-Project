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

interface Comment {
  _id: string;
  content: string;
  author: string;
}

const AdminCommentsScreen: React.FC = () => {
  const [flaggedComments, setFlaggedComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFlaggedComments = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/comment/flagged`);
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

  useEffect(() => {
    setLoading(true);
    fetchFlaggedComments().finally(() => setLoading(false));
  }, []);

  const handleApproveComment = async (id: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/comment/${id}/unflag`, {
        method: "PUT",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
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
      const res = await fetch(`${SERVER_URL}/comment/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      setFlaggedComments((prev) =>
        prev.filter((comment) => comment._id !== id)
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to delete comment.");
    }
  };

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
        <Text>Loading flagged comments...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    <View style={styles.container}>
      <AdminNav currentScreen="adminComments" />
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

export default AdminCommentsScreen;
