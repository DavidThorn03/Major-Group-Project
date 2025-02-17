import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { getPostsByThread } from "./services/getThreadPosts";
import { getUser } from "./services/getUser";
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
import { Likes } from "./services/updateLikes";
import * as AsyncStorage from "../util/AsyncStorage.js";
import BottomNavBar from "./components/BottomNavBar";
import axios from "axios";

dayjs.extend(relativeTime);

const Thread = () => {
  const [user, setUser] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { threadID, threadName } = route.params || {};

  console.log("Thread parameters:", { threadID, threadName });

  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [userSearched, setUserSearched] = useState(false);

  const liked = (<Icon name="heart" size={25} color="red" />) as JSX.Element;
  const unliked = (
    <Icon name="hearto" size={25} color="white" />
  ) as JSX.Element;

  // Fetch posts for the thread
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          console.log("User data:", parsedUserData);
          // Check if the user is a member of the thread
          setIsMember(parsedUserData.threads?.includes(threadID));
          setUserSearched(true);
        } else {
          console.log("No user data found");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, [threadID]);

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

  const handleJoinLeave = async () => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }

    try {
      const url = `${API_URL}/user/${user._id}/threads/${threadID}`;
      if (isMember) {
        // Logic to leave the thread
        await axios.post(`${url}/leave`);
        setIsMember(false);
      } else {
        // Logic to join the thread
        await axios.post(`${url}/join`);
        setIsMember(true);
      }
    } catch (err) {
      console.error("Error updating membership status:", err);
    }
  };

  const likePost = async (post) => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }
    let action;

    if (post.likes.includes(user.email)) {
      action = -1;
    } else {
      action = 1;
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
      const filters = {
        post: post.postTitle,
        like: user.email,
        action: action,
      };
      await Likes(filters);
    } catch (err) {
      console.error(err);
    }
  };

  const getLike = (post) => {
    if (!user) return unliked;
    return post.likes.includes(user.email) ? liked : unliked;
  };

  const navigateToPost = (post) => {
    AsyncStorage.setItem("Post", { id: post._id, threadName: threadName });
    navigation.navigate("post");
  };

  return (
    <Container>
      <Header>
        <HeaderText>{threadName}</HeaderText>
        <JoinButton onPress={handleJoinLeave} joined={isMember} />
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
