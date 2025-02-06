import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getPostsByThread } from "./services/getThreadPosts";
import { getUser } from "./services/getUser";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useUser } from "./context/UserContext"; // Import useUser
import ThreadStyles from "./styles/ThreadStyles";
import Icon from "react-native-vector-icons/AntDesign";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { API_URL } from "./constants/apiConfig";

dayjs.extend(relativeTime);

const Thread = () => {
  const { user, updateUser } = useUser(); // Use UserContext
  const route = useRoute();
  const navigation = useNavigation();
  const { threadID, threadName } = route.params || {};

  console.log("Thread parameters:", { threadID, threadName });

  const [posts, setPosts] = useState([]);
  const [joined, setJoined] = useState(false);

  const liked = <Icon name="heart" size={25} color="red" />;
  const unliked = <Icon name="hearto" size={25} color="red" />;

  // Fetch posts for the thread
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

  // Check if user already joined the thread
  useEffect(() => {
    if (user && user.threads?.includes(threadID)) {
      setJoined(true);
    }
  }, [user, threadID]);

  // Handle joining the thread
  const handleJoinThread = async () => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }

    try {
      console.log("Joining thread...", {
        userId: user._id,
        threadId: threadID,
      });

      const response = await fetch(`${API_URL}/user/${user._id}/joinThread`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId: threadID }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error joining thread:", errorData);
        return;
      }

      console.log("User successfully joined the thread");

      setUser((prevUser) => ({
        ...prevUser,
        threads: [...prevUser.threads, threadID],
      }));
      setJoined(true);
    } catch (error) {
      console.error("Error making join thread request:", error);
    }
  };

  const handleLeaveThread = async () => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }

    try {
      console.log("Leaving thread...", {
        userId: user._id,
        threadId: threadID,
      });

      const response = await fetch(`${API_URL}/user/${user._id}/leaveThread`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId: threadID }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error leaving thread:", errorData);
        return;
      }

      console.log("User successfully left the thread");

      getUser((prevUser) => ({
        ...prevUser,
        threads: prevUser.threads.filter((id) => id !== threadID),
      }));
      setJoined(false);
    } catch (error) {
      console.error("Error making leave thread request:", error);
    }
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
      await fetch(`${API_URL}/post/likes`, {
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

        {joined ? (
          <TouchableOpacity
            style={ThreadStyles.joinedButton}
            onPress={handleLeaveThread}
          >
            <Text style={ThreadStyles.joinedButtonText}>Joined</Text>
          </TouchableOpacity>
        ) : (
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
                <TouchableOpacity onPress={() => navigateToPost(item._id)}>
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
