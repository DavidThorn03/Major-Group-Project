import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getPostsByThread } from "./services/getThreadPosts";
import { getUser } from "./services/getUser";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useUser } from "./context/UserContext"; // Import useUser
import {
  Container,
  Header,
  PostCard,
  Author,
  Timestamp,
  Content,
  ButtonContainer,
} from "./components/ThreadStyles"; // Updated import
import Icon from "react-native-vector-icons/AntDesign";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { API_URL } from "./constants/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

dayjs.extend(relativeTime);

const Thread = () => {
  const { user, updateUser } = useUser(); // Use UserContext
  const route = useRoute();
  const navigation = useNavigation();
  const { threadID, threadName } = route.params || {};

  console.log("Thread parameters:", { threadID, threadName });

  const [posts, setPosts] = useState([]);
  const [joined, setJoined] = useState(false);

  const liked = (<Icon name="heart" size={25} color="red" />) as JSX.Element;
  const unliked = (<Icon name="hearto" size={25} color="red" />) as JSX.Element;

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

    if (user.threads?.includes(threadID)) {
      console.log("User already joined the thread");
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

      const updatedUserData = await response.json();
      updateUser(updatedUserData.user);
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

      const updatedUserData = await response.json();
      console.log("User successfully left the thread");

      // Update both context and AsyncStorage with the new user data
      updateUser(updatedUserData.user);
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
    <Container>
      <Header>{threadName}</Header>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToPost(item._id)}>
            <PostCard>
              <Author>{item.author}</Author>
              <Timestamp>{dayjs(item.createdAt).fromNow()}</Timestamp>
              <Content>{item.content}</Content>
              <ButtonContainer>
                <TouchableOpacity onPress={() => likePost(item)}>
                  {getLike(item)}
                </TouchableOpacity>
                <Text>{item.likes.length}</Text>
                <TouchableOpacity onPress={() => navigateToPost(item._id)}>
                  <Icon name="message1" size={25} />
                </TouchableOpacity>
                <Text>{item.comments.length}</Text>
              </ButtonContainer>
            </PostCard>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
};

export default Thread;
