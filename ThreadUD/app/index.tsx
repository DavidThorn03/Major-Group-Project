import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Container,
  Header,
  PostCard,
  ThreadName,
  GeneralText,
  Button,
} from "./components/StyledWrappers";
import IndexStyles from "./styles/IndexStyles";
import { getPosts } from "./services/getPost";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { Likes } from "./services/updateLikes";
import io from "socket.io-client";

const IndexPage = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [userSearched, setUserSearched] = useState(false);
  const [socket, setSocket] = useState(null);
  

  const liked = <Icon name="heart" size={25} color="red" />;
  const unliked = <Icon name="hearto" size={25} color="red" />;

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
          const postsData = await getPosts();
          setPosts(postsData);
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load posts.");
        console.error(err);
      }
    };

    fetchPosts();
  }, [userSearched]);

  useEffect(() => {
    if (socket) {
      console.log("Disconnecting previous socket before setting up a new one");
      socket.disconnect();
    }

    const newSocket = io("http://192.168.0.11:3000/");

    newSocket.on("update posts", (updatePosts) => {
      console.log("Received updated comments:", updatePosts);
      setPosts(updatePosts);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

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
    
      if (post.likes.includes(user.email)) {
        action = -1;
      } else {
        action = 1;
      }
    
      try {
        const filters = { post: post.postTitle, like: user.email, action: action };
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

  const ViewPost = (post) => {
    AsyncStorage.setItem("Post",  {id: post._id, threadName: post.threadName});
    navigation.navigate("post");
  };

  return (
    <Container>
      <Header>Welcome to the ThreadUD</Header>
      {posts.length === 0 ? (
        <GeneralText>
          No posts available. Start by creating a new post!
        </GeneralText>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            console.log("Post item:", item); // Debug log
            return (
              <PostCard>
                <TouchableOpacity
                  onPress={() =>
                    navigateToThread(item.threadID, item.threadName)
                  }
                >
                  <ThreadName>{item.threadName}</ThreadName>
                </TouchableOpacity>
                <GeneralText style={IndexStyles.postContent}>
                  {item.content}
                </GeneralText>
                <GeneralText style={IndexStyles.author}>
                  Author: {item.author}
                </GeneralText>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => likePost(item)}>
                    {getLike(item)}
                  </TouchableOpacity>
                  <GeneralText> {item.likes.length} </GeneralText>
                  <TouchableOpacity onPress={() => ViewPost(item)}>
                    <Icon name="message1" size={25} />
                  </TouchableOpacity>
                  <GeneralText> {item.comments.length} </GeneralText>
                </View>
              </PostCard>
            );
          }}
        />
      )}
      <Button
        title="Create Post"
        onPress={() => console.log("Navigate to Create Post")}
      />
      {user && (
        <Button
          title="Profile"
          onPress={() => navigation.navigate("profile")}
          style={{ marginTop: 8 }}
        />
      )}
      <Button
        title="Login"
        onPress={() => navigation.navigate("login")}
        style={{ marginTop: 16 }}
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate("register")}
        style={{ marginTop: 8 }}
      />
      <Button
        title="Search"
        onPress={() => navigation.navigate("search")}
        style={{ marginTop: 8 }}
      />
    </Container>
  );
};

export default IndexPage;
