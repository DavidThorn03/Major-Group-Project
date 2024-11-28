import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
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
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableHighlight } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";


const IndexPage = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (err) {
        setError("Failed to load posts.");
        console.error(err); 
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        setUser(userData);
        console.log("User data:", userData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const likePost = (post) => {
    
  }

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
  return (
    <Container>
      <Header>Welcome to the ThreadUD {user.email}</Header>
      {posts.length === 0 ? (
        <GeneralText>
          No posts available. Start by creating a new post!
        </GeneralText>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostCard>
              <ThreadName>{item.threadName}</ThreadName>
              <GeneralText style={IndexStyles.postContent}>
                {item.content}
              </GeneralText>
              <GeneralText style={IndexStyles.author}>
                Author: {item.author}
              </GeneralText>
              <GeneralText>Likes: {item.likes}</GeneralText>
              <TouchableHighlight onPress={() => likePost(item)}>
              <Icon name="hearto" size={30} color="black" /></TouchableHighlight>
            </PostCard>
          )}
        />
      )}
      <Button
        title="Create Post"
        onPress={() => console.log("Navigate to Create Post")}
      />
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
    </Container>
  );
};

export default IndexPage;
