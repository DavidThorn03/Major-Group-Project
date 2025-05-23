import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { getPostsByThread } from "./services/getThreadPosts";
import {
  Container,
  Header,
  HeaderText,
  JoinButton,
  PostCard,
  Author,
  AuthorWithIcon,
  Timestamp,
  Content,
  ButtonContainer,
  ListFooterSpace,
} from "./components/ThreadStyles";
import Icon from "react-native-vector-icons/AntDesign";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import IP from "../config/IPAddress.js";
import * as AsyncStorage from "../util/AsyncStorage.js";
import BottomNavBar from "./components/BottomNavBar";
import { Likes } from "./services/updateLikes";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


dayjs.extend(relativeTime);

const Thread = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { threadID, threadName } = useLocalSearchParams();

  console.log("Thread parameters:", { threadID, threadName });

  const [posts, setPosts] = useState([]);
  const [joined, setJoined] = useState(false);

  const liked = (<Icon name="heart" size={25} color="red" />) as JSX.Element;
  const unliked = (
    <Icon name="hearto" size={25} color="white" />
  ) as JSX.Element;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        if (userData) {
          setUser(userData);
          console.log("User data:", userData);
        } else {
          console.log("No user data found");
          setUser(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

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
      router.push("/login");
      return;
    }

    const action = joined ? "leaveThread" : "joinThread";
    const successMessage = joined ? "left" : "joined";

    try {
      const response = await fetch(`${IP}/user/${user._id}/${action}`, {
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
      setUser(updatedUserData.user);
      await AsyncStorage.setItem("User", updatedUserData.user);
      setJoined(!joined);
    } catch (error) {
      console.error(`Error making ${successMessage} thread request:`, error);
    }
  };

  const likePost = async (post) => {
    if (!user) {
      console.log("User not logged in");
      router.push("/login");
      return;
    }
    let action;

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

    if (post.likes.includes(user.email)) {
      action = -1;
    } else {
      action = 1;
    }

    try {
      const filters = {
        post: post._id,
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

  const navigateToPost = (postID) => {
    router.push({pathname: "/post", params: { postID, threadName }});
  };

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
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
              <AuthorWithIcon>{item.author.split("@")[0]}</AuthorWithIcon>
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
                  style={{ marginLeft: 12 }}
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
        ListFooterComponent={<ListFooterSpace />}
      />
      <BottomNavBar />
    </Container>
    </SafeAreaView>
  );
};

export default Thread;
