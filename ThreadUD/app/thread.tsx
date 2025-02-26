import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { getPostsByThread } from "./services/getThreadPosts";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useUser } from "./context/UserContext"; // Import useUser
import {
  Container,
  Header,
  HeaderText,
  JoinButton,
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
import * as AsyncStorage from "../util/AsyncStorage.js";
import BottomNavBar from "./components/BottomNavBar";

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
  const unliked = (
    <Icon name="hearto" size={25} color="white" />
  ) as JSX.Element;

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

  const handleJoinLeaveThread = async () => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }

    const action = joined ? "leaveThread" : "joinThread";
    const successMessage = joined ? "left" : "joined";

    try {
      const response = await fetch(`${API_URL}/user/${user._id}/${action}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId: threadID }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error ${successMessage} thread:`, errorData);
        return;
      }

      const updatedUserData = await response.json();
      updateUser(updatedUserData.user);
      setJoined(!joined);
    } catch (error) {
      console.error(`Error making ${successMessage} thread request:`, error);
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

  const navigateToPost = (postID) => {
    navigation.navigate("post", { postID, threadName });
  };

  return (
    <Container>
      <Header>
        <HeaderText>{threadName}</HeaderText>
        <JoinButton onPress={handleJoinLeaveThread} joined={joined} />
      </Header>
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
                <Text style={{ color: "white", marginLeft: 5 }}>
                  {item.likes.length}
                </Text>
                <TouchableOpacity
                  onPress={() => navigateToPost(item._id)}
                  style={{ marginLeft: 15 }}
                >
                  <Icon name="message1" size={25} color="white" />
                </TouchableOpacity>
                <Text style={{ color: "white", marginLeft: 5 }}>
                  {item.comments.length}
                </Text>
              </ButtonContainer>
            </PostCard>
          </TouchableOpacity>
        )}
      />
      <BottomNavBar />
    </Container>
  );
};

export default Thread;
