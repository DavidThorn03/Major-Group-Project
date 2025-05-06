import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import {
  Container,
  Header,
  HeaderText,
  PostCard,
  ThreadName,
  GeneralText,
  Button,
  Timestamp,
  PostContent,
  AuthorWithIcon,
  ListFooterSpace,
  ThreadCard,
  ThreadInfo,
  UserInfo,
  UserInfoItem,
  ButtonGroupContainer,
  PostActionsContainer,
  PostActionSpacer,
} from "./components/ProfileStyles";
import { NavigatorContext } from "expo-router/build/views/Navigator.js";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import { getUserPosts } from "./services/getUserPosts";
import Icon from "react-native-vector-icons/AntDesign";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Likes } from "./services/updateLikes";
import { getThreads } from "./services/getThreads";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


const ProfileScreen = () => {
  const router = useRouter();
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
      } else {
        console.log("No user found in storage");
        router.push("/login");
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
      if (user && user.threads && user.threads.length > 0) {
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
      } else {
        setThreads([]);
      }
    };

    fetchThreads();
  }, [user]);

  const navigateToThread = (threadID, threadName) => {
    console.log("Navigating to thread with:", { threadID, threadName });
    router.push({pathname: "/thread", params: { threadID, threadName }});
  };

  const ViewPost = (post) => {
    router.push({pathname: "/post", params: {
      postID: post._id,
      threadName: post.threadName,
    }});
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

  const displayPosts = () => {
    if (posts.length === 0) {
      return (
        <GeneralText>
          No posts available.{"\n"}Start by creating a new post!
        </GeneralText>
      );
    }

    return (
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <PostCard>
              <TouchableOpacity
                onPress={() => navigateToThread(item.threadID, item.threadName)}
              >
                <ThreadName>{item.threadName}</ThreadName>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => ViewPost(item)}>
                <Timestamp>{dayjs(item.createdAt).fromNow()}</Timestamp>
                <PostContent>{item.content}</PostContent>
                <AuthorWithIcon>{item.author.split("@")[0]}</AuthorWithIcon>
                <PostActionsContainer>
                  <TouchableOpacity onPress={() => likePost(item)}>
                    {getLike(item)}
                  </TouchableOpacity>
                  <GeneralText> {item.likes.length} </GeneralText>
                  <PostActionSpacer />
                  <TouchableOpacity onPress={() => ViewPost(item)}>
                    <Icon name="message1" size={25} color="white" />
                  </TouchableOpacity>
                  <GeneralText> {item.comments.length} </GeneralText>
                </PostActionsContainer>
              </TouchableOpacity>
            </PostCard>
          );
        }}
        ListFooterComponent={<ListFooterSpace />}
        showsVerticalScrollIndicator={true}
        style={{ flex: 1 }}
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
            <ThreadCard>
              <TouchableOpacity
                onPress={() => navigateToThread(item._id, item.threadName)}
              >
                <ThreadName>{item.threadName}</ThreadName>
                <ThreadInfo>Year: {item.year}</ThreadInfo>
                <ThreadInfo>Course: {item.course}</ThreadInfo>
              </TouchableOpacity>
            </ThreadCard>
          );
        }}
        ListFooterComponent={<ListFooterSpace />}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1 }}
      />
    );
  };

  if (!user) {
    return <Text>Loading user...</Text>;
  }
  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    <Container>
      <Header>
        <HeaderText>Profile Page</HeaderText>
      </Header>
      <View style={{ flex: 1 }}>
        <UserInfo>
          <UserInfoItem label="Name" value={user.userName} />
          <UserInfoItem label="Email" value={user.email} />
          <UserInfoItem label="Course" value={user.course} />
          <UserInfoItem label="Year" value={user.year} />
        </UserInfo>
        <ButtonGroupContainer>
          <Button
            title="My Posts"
            onPress={() => setPostsActive(true)}
            style={{ marginTop: 0 }}
            isActive={postsActive}
          />
          <Button
            title="Threads"
            onPress={() => setPostsActive(false)}
            style={{ marginTop: 0 }}
            isActive={!postsActive}
          />
          <Button
            title="Update Profile"
            onPress={() => router.push("/updateProfile")}
            style={{ marginTop: 0 }}
          />
        </ButtonGroupContainer>
        {postsActive ? (
          <View style={{ flex: 1 }}>{displayPosts()}</View>
        ) : (
          <View style={{ flex: 1 }}>{displayThread()}</View>
        )}
      </View>
      <BottomNavBar />
    </Container>
  </SafeAreaView>
  );
};

export default ProfileScreen;
