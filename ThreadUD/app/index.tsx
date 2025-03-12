import React, { useEffect, useState } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import {
  Container,
  PostCard,
  ThreadName,
  Timestamp,
  GeneralText,
  PostContent,
  Author,
  ListFooterSpace,
} from "./components/IndexStyles";
import { getPosts } from "./services/getPost";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { Likes } from "./services/updateLikes";
import { getPostsByThread } from "./services/getPostsByThread.js";
import { getPostsByYear } from "./services/getPostsByYear.js";
import BottomNavBar from "./components/BottomNavBar";
import NavBar from "./components/NavBar";
import IP from "../config/IPAddress.js";

dayjs.extend(relativeTime);

const IndexPage = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [userSearched, setUserSearched] = useState(false);

  const liked = <Icon name="heart" size={25} color="red" />;
  const unliked = <Icon name="hearto" size={25} color="white" />;

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
        setUserSearched(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (userSearched) {
          if (!user) {
            const postsData = await getPosts();
            setPosts(postsData);
            setLoading(false);
          }
          else if (user.threads.length > 0) {
            const filter = { ids: user.threads };
            const postsData = await getPostsByThread(filter);
            setPosts(postsData);
            setLoading(false);
          }
          else {
            const filter = { year: user.year };
            const postsData = await getPostsByYear(filter);
            setPosts(postsData);
            setLoading(false);
          }

        }
      } catch (err) {
        setError("Failed to load posts.");
        console.error(err);
      }
    };

    fetchPosts();
  }, [userSearched]);

  if (loading) {
    return (
      <Container>
        <GeneralText>Loading posts...</GeneralText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <GeneralText>{error}</GeneralText>
      </Container>
    );
  }

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
    if (!user) {
      return unliked;
    } else if (post.likes.includes(user.email)) {
      return liked;
    } else {
      return unliked;
    }
  };

  const navigateToThread = (threadID, threadName) => {
    console.log("Navigating to thread with:", { threadID, threadName });
    navigation.navigate("thread", { threadID, threadName });
  };

  const ViewPost = (postID, threadName) => {
    navigation.navigate("post", { postID, threadName });
  };

  return (
    <Container>
      <NavBar />
      {posts.length === 0 ? (
        <GeneralText>
          No posts available. Start by creating a new post!
        </GeneralText>
      ) : (
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
                <TouchableOpacity
                  onPress={() => ViewPost(item._id, item.threadName)}
                >
                  <Timestamp>{dayjs(item.createdAt).fromNow()}</Timestamp>
                  <PostContent>{item.content}</PostContent>
                  <Author>Author: {item.author}</Author>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => likePost(item)}>
                      {getLike(item)}
                    </TouchableOpacity>
                    <GeneralText> {item.likes.length} </GeneralText>
                    <View style={{ paddingHorizontal: 5 }} />
                    <TouchableOpacity
                      onPress={() => ViewPost(item._id, item.threadName)}
                    >
                      <Icon name="message1" size={25} color="white" />
                    </TouchableOpacity>
                    <GeneralText> {item.comments.length} </GeneralText>
                  </View>
                </TouchableOpacity>
              </PostCard>
            );
          }}
          ListFooterComponent={<ListFooterSpace />}
        />
      )}
      <BottomNavBar />
    </Container>
  );
};

export default IndexPage;
