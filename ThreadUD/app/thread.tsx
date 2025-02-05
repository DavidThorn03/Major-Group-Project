import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getPostsByThread } from "./services/getThreadPosts";
import { useRoute, useNavigation } from "@react-navigation/native";
import ThreadStyles from "./styles/ThreadStyles"; // Import the styles

const Thread = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { threadID, threadName } = route.params || {};

  console.log("Thread parameters:", { threadID, threadName });

  if (!threadID) {
    console.error("Error: threadID is required to fetch posts.");
  }
  const [posts, setPosts] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!threadID) {
      console.error("Error: threadID is missing!");
      return;
    }

    const fetchPosts = async () => {
      const data = await getPostsByThread(threadID);
      setPosts(data);
    };
    fetchPosts();
  }, [threadID]);

  const handleJoinThread = async () => {
    console.log(`User joined thread: ${threadID}`);
    setJoined(true);
  };

  const navigateToPost = (postId) => {
    navigation.navigate("PostPage", { postId });
  };

  return (
    <View style={ThreadStyles.container}>
      <View style={ThreadStyles.header}>
        <Text style={ThreadStyles.headerText}>{threadName}</Text>
        {!joined && (
          <TouchableOpacity
            style={ThreadStyles.joinButton}
            onPress={handleJoinThread}
          >
            <Text style={ThreadStyles.joinButtonText}>Join Thread</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={ThreadStyles.postCard}
            onPress={() => navigateToPost(item._id)}
          >
            <Text style={ThreadStyles.author}>{item.author}</Text>
            <Text style={ThreadStyles.timestamp}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
            <Text style={ThreadStyles.content}>{item.content}</Text>
            <TouchableOpacity style={ThreadStyles.likeButton}>
              <Text style={ThreadStyles.likeButtonText}>
                Like ({item.likes.length})
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Thread;
