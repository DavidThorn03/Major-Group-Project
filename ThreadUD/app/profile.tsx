import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import {
  Container,
  Header,
  PostCard,
  ThreadName,
  GeneralText,
  Button,
} from "./components/IndexStyles";
import { NavigatorContext } from "expo-router/build/views/Navigator.js";
import { useNavigation } from "@react-navigation/native";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import { getUserPosts } from "./services/getUserPosts";
import Icon from "react-native-vector-icons/AntDesign";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Timestamp,
  PostContent,
  Author,
} from "./components/IndexStyles";
import { Likes } from "./services/updateLikes";
import { getThreads } from "./services/getThreads";


const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [postsActive, setPostsActive] = useState(true);

  const liked = <Icon name="heart" size={25} color="red" />;
  const unliked = <Icon name="hearto" size={25} color="white" />;


  useEffect(() => {
    const fetchUserFromStorage = async () => {
      const storedUser = await AsyncStorage.getItem("User");
      console.log("Stored user:", storedUser);
      if (storedUser) {
        setUser(storedUser);
        console.log("User from storage: ", storedUser);
      }
      else {
        console.log("No user found in storage");
        navigation.navigate("login");
      }
    };

    fetchUserFromStorage();
  }, []);

  useEffect(() => {
      const fetchPosts = async () => {
        try {
          if (user) {
            var postData = await getUserPosts({ author: user.email });
            if (!Array.isArray(postData)) {
              postData = [postData];
            }
            setPosts(postData);
            console.log("Posts:", postData);
          }
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchPosts();
    }, [user]);

    useEffect(() => {
      const fetchThreads = async () => {
        if(user && user.threads && user.threads.length > 0) {
          const fetchData = async () => {
            try {
              const response = await getThreads({ threadIDs: user.threads });
              if (!response || response.length === 0) {
                setThreads([]);
              } else {
                setThreads(response);
              }
            } catch (error) {
              console.error("Error fetching search results:", error);
            }
          };
          fetchData();
        }
        else {
          setThreads([]);
        }
      };
  
      fetchThreads();
    }, [user]);

  const navigateToThread = (threadID, threadName) => {
      console.log("Navigating to thread with:", { threadID, threadName });
      navigation.navigate("thread", { threadID, threadName });
    };
  
    const ViewPost = (post) => {
      navigation.navigate("post", { postID: post._id, threadName: post.threadName });
    };

    const likePost = async (post) => {
        if (!user) {
          console.log("User not logged in");
          navigation.navigate("login");
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

  const displayPosts = () => {
  if (posts.length === 0) {
    return <GeneralText>No posts available. Start by creating a new post!</GeneralText>;
  }
  
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        console.log("Post item:", item);
        return (
          <PostCard>
            <TouchableOpacity
              onPress={() =>
                navigateToThread(item.threadID, item.threadName)
              }
            >
              <ThreadName>{item.threadName}</ThreadName>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => ViewPost(item)}>
              <Timestamp>{dayjs(item.createdAt).fromNow()}</Timestamp>
              <PostContent>{item.content}</PostContent>
              <Author>Author: {item.author}</Author>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => likePost(item)}>
                  {getLike(item)}
                </TouchableOpacity>
                <GeneralText> {item.likes.length} </GeneralText>
                <View style={{ paddingHorizontal: 5 }} />
                <TouchableOpacity onPress={() => ViewPost(item)}>
                  <Icon name="message1" size={25} color="white" />
                </TouchableOpacity>
                <GeneralText> {item.comments.length} </GeneralText>
              </View>
            </TouchableOpacity>
          </PostCard>
        );
      }}
    />
  );
};
const displayThread = () => {
  if (threads.length === 0) {
    return <GeneralText>You arent following any threads!</GeneralText>;
  }
  
  return (
    <FlatList
      data={threads}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        console.log("Thread item:", item);
        return (
          <Container>
            <TouchableOpacity
              onPress={() => navigateToThread(item._id, item.threadName)}
            >
              <ThreadName>{item.threadName}</ThreadName>
              <GeneralText>Year: {item.year}</GeneralText>
              <GeneralText>Course: {item.course}</GeneralText>
            </TouchableOpacity>
          </Container>
        );
      }}
    />
  );
};


  const logOut = async () => {
    await AsyncStorage.removeItem("User");
    setUser(null);
    navigation.navigate("index");
  };

  if (!user) {
    return <Text>Loading user...</Text>;
  }
  return (
    <Container>
      <NavBar />
      <View>
        <Text className="text-2xl font-bold text-red-500">Profile</Text>
        <Text>User Name: {user.userName}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Course: {user.course}</Text>
        <Text>Year: {user.year}</Text>
        <Button title="Log Out" onPress={logOut} style={{ marginTop: 8 }} />
        <View style={{ flexDirection: "row" }}>
          <Button title="My Posts" onPress={() => setPostsActive(true)} style={{ marginTop: 8 }} />
          <Button title="Threads" onPress={() => setPostsActive(false)} style={{ marginTop: 8 }} />
          <Button title="Update Profile" onPress={() => navigation.navigate("updateProfile")} style={{ marginTop: 8 }} />
        </View>
        {postsActive && 
        <View>
          {displayPosts()}
        </View>
        }
      {!postsActive && 
      <View>
        {displayThread()}
      </View>
      }
      </View>
      <BottomNavBar />
    </Container>
  );
};

export default ProfileScreen;
