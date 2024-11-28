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
import {Likes} from "./services/updateLikes";

const IndexPage = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [userSearched, setUserSearched] = useState(false);

  const liked = <Icon name="heart" size={25} color="red" />;
  const unliked = <Icon name="hearto" size={25} color="red" />;


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        if(userData) {
          setUser(userData);
          console.log("User data:", userData);
        }
        else {
          console.log("No user data found");
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
    if (user) { 
      console.log("User logged in", user.email);
      let likes = post.likes;
      if(likes.includes(user.email)) {
        likes.pop(user.email);
      }
      else{
        likes.push(user.email);
      }
      console.log("Likes", likes);
      const filters = { post: post.postTitle, likes: likes };

      try {
        const like = await Likes(filters);
        console.log("Like", like);
      } catch (err) {
        console.error(err);
      }
      window.location.reload();
    }
    else {
      console.log("User not logged in");
      navigation.navigate("login");
    }
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
              <TouchableHighlight onPress={() => likePost(item)}>{unliked}</TouchableHighlight>
              <GeneralText>          {item.likes.length}</GeneralText>
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
