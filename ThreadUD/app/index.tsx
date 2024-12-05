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
  
    const updatedPosts = posts.map((p) => {
      if (p._id === post._id) {
        let updatedLikes;
  
        if (p.likes.includes(user.email)) {
          updatedLikes = p.likes.filter((email) => email !== user.email);
        } else {
          updatedLikes = [...p.likes, user.email];
        }
  
        return { ...p, likes: updatedLikes }; 
      }
      return p;
    });
  
    setPosts(updatedPosts);
  
    try {
      const updatedPost = updatedPosts.find((p) => p._id === post._id);
      const filters = { post: post.postTitle, likes: updatedPost.likes };
      await Likes(filters);
    } catch (err) {
      console.error(err);
    }
  };
  

  const getLike = (post) => {
    if(!user) {
      return unliked;
    }
    else if(post.likes.includes(user.email)) {
      return liked;
    }
    else {
      return unliked;
    }
  }


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
          renderItem={({ item }) => (
            <PostCard>
              <ThreadName>{item.threadName}</ThreadName>
              <GeneralText style={IndexStyles.postContent}>
                {item.content}
              </GeneralText>
              <GeneralText style={IndexStyles.author}>
                Author: {item.author}
              </GeneralText>
              <TouchableHighlight onPress={() => likePost(item)}>{getLike(item)}</TouchableHighlight>
              <GeneralText>          {item.likes.length}</GeneralText>
            </PostCard>
          )}
        />
      )}
      <Button
        title="Create Post"
        onPress={() => console.log("Navigate to Create Post")}
      />
      {user && 
      <Button
        title="Profile"
        onPress={() => navigation.navigate("profile")}
        style={{ marginTop: 8 }}
      />
    }
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
