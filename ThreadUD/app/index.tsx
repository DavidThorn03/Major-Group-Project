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
  AuthorWithIcon,
  ListFooterSpace,
} from "./components/IndexStyles";
import { getPosts } from "./services/getPost";
import Icon from "react-native-vector-icons/AntDesign";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { Likes } from "./services/updateLikes";
import { getPostsByThread } from "./services/getPostsByThread.js";
import { getPostsByCourse } from "./services/getPostsByCourse.js";
import BottomNavBar from "./components/BottomNavBar";
import NavBar from "./components/NavBar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPostsByYear } from "./services/getPostsByYear.js";

dayjs.extend(relativeTime);

const IndexPage = () => {
  const router = useRouter();
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

          // Check if the user is an admin
          if (userData.admin) {
            router.replace("/adminPosts");
            return; // Exit early if navigating
          }
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
          let postData = [];
          if (!user) {
            postData = await getPosts();
            setPosts(postData);
            setLoading(false);
            return;
          } else if (user.threads && user.threads.length > 0) {
            const filter = { ids: user.threads };
            postData = await getPostsByThread(filter);
            setPosts(postData);
            setLoading(false);
            if (postData.length > 0) {
              return;
            }
          }
          const filter = { course: user.course };
          postData = await getPostsByCourse(filter);
          if (postData.length > 0) {
            setPosts(postData);
            setLoading(false);
            return;
          }
          postData = await getPostsByYear({ year: user.year });
          console.log("Post data by year:", postData);
          if (postData.length > 0) {
            setPosts(postData);
            setLoading(false);
            return;
          }
          postData = await getPosts();
          setPosts(postData);
          setLoading(false);
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
    router.push({ pathname: "/thread", params: { threadID, threadName } });
  };

  const ViewPost = (postID, threadName) => {
    router.push({ pathname: "/post", params: { postID, threadName } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
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
                    <AuthorWithIcon>{item.author.split("@")[0]}</AuthorWithIcon>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity onPress={() => likePost(item)}>
                        {getLike(item)}
                      </TouchableOpacity>
                      <GeneralText> {item.likes.length} </GeneralText>
                      <View style={{ paddingHorizontal: 4 }} />
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
    </SafeAreaView>
  );
};

export default IndexPage;
