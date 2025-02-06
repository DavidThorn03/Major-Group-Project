import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getPostsByThread } from "./services/getThreadPosts";
import { useRoute, useNavigation } from "@react-navigation/native";
import ThreadStyles from "./styles/ThreadStyles";
import Icon from "react-native-vector-icons/AntDesign"; // Import Icon for like and comment buttons
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime); // Enable relative time support

const Thread = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { threadID, threadName } = route.params || {};

  console.log("Thread parameters:", { threadID, threadName });

  const [posts, setPosts] = useState([]);
  const [joined, setJoined] = useState(false);
  const [user, setUser] = useState(null);

  const liked = <Icon name="heart" size={25} color="red" />;
  const unliked = <Icon name="hearto" size={25} color="red" />;

  useEffect(() => {
    const fetchUser = async () => {
      // Mock user fetch (replace with actual logic if needed)
      setUser({ email: "test@example.com" });
    };

    fetchUser();
  }, []);

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

  const handleJoinThread = () => {
    console.log(`User joined thread: ${threadID}`);
    setJoined(true);
  };

  const likePost = async (post) => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }

    const updatedPosts = posts.map((p) => {
      if (p._id === post._id) {
        const updatedLikes = p.likes.includes(user.email)
          ? p.likes.filter((email) => email !== user.email)
          : [...p.likes, user.email];
        return { ...p, likes: updatedLikes };
      }
      return p;
    });

    setPosts(updatedPosts);

    try {
      await fetch("http://192.168.1.17:3000/api/post/likes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: post.postTitle,
          likes: updatedPosts.find((p) => p._id === post._id).likes,
        }),
      });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const getLike = (post) => {
    if (!user) return unliked;
    return post.likes.includes(user.email) ? liked : unliked;
  };

  const navigateToPost = (postId) => {
    navigation.navigate("post", { postId });
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
            onPress={() => navigateToPost(item._id)} // Navigate to the post page when clicking anywhere on the card
          >
            <View>
              <Text style={ThreadStyles.author}>{item.author}</Text>
              <Text style={ThreadStyles.timestamp}>
                {dayjs(item.createdAt).fromNow()}
              </Text>
              <Text style={ThreadStyles.content}>{item.content}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => likePost(item)}>
                  {getLike(item)}
                </TouchableOpacity>
                <Text style={ThreadStyles.likeCount}>{item.likes.length}</Text>
                <TouchableOpacity
                  onPress={() => navigateToPost(item._id)} // Navigate to the post page when clicking the comment icon
                >
                  <Icon name="message1" size={25} />
                </TouchableOpacity>
                <Text style={ThreadStyles.commentCount}>
                  {item.comments.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Thread;
