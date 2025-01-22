import React, { useEffect, useState } from "react";
import { FlatList, View, TextInput } from "react-native";
import {
  Container,
  Header,
  PostCard,
  ThreadName,
  GeneralText
} from "./components/StyledWrappers";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import {Likes} from "./services/updateLikes";
import {CommentLikes} from "./services/updateCommentLikes";
import {getComments} from "./services/getComments";
import {AddComment} from "./services/addComment";
import IndexStyles from "./styles/IndexStyles";

const PostPage = () => {
  const navigation = useNavigation();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [postSearched, setPostsearched] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, onChangeText] = React.useState("");

  const postLiked = <Icon name="heart" size={25} color="red" />;
  const postUnliked = <Icon name="hearto" size={25} color="red" />;
  const liked = <Icon name="heart" size={15} color="red" />;
  const unliked = <Icon name="hearto" size={15} color="red" />;


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
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await AsyncStorage.getItem("Post");
        if(postData) {
          setPost(JSON.parse(postData));
          console.log("Post data:", postData);
          setPostsearched(true);
        }
        else {
          console.log("No post data found");
          setPost(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, []);
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (postSearched) { 
          if (!post.comments || post.comments.length === 0) {
            console.log("No comments found");
            setComments([]);
            setLoading(false);
            return;
          }
          const commentData = await getComments( { id: post.comments } ); 
          console.log("Comment data:", commentData);
          setComments(commentData);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [postSearched]); 
  if (loading) {
    return (
      <Container>
        <GeneralText>Loading comments...</GeneralText>
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
    let updatedLikes;
  
    if (post.likes.includes(user.email)) {
      updatedLikes = post.likes.filter((email) => email !== user.email);
    } else {
      updatedLikes = [...post.likes, user.email];
    }
    const updatedPost = { ...post, likes: updatedLikes };
  
    setPost(updatedPost);
  
    try {
      const filters = { post: post.postTitle, likes: updatedPost.likes };
      await Likes(filters);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (post) => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }
    let newComment = { content: text, author: user.email, likes: [], replies: [] };
    let updatedComments = [ ...comments, newComment ];
    console.log("Updated comments: ", updatedComments);
    setComments(updatedComments);
  
    try {
      const commentFilters = { comment: newComment };
      const postFilters = { post: post._id, comments: post.comments };
      console.log("Adding comment ");
      await AddComment(commentFilters, postFilters);
      console.log("Comment added");
    } catch (err) {
      console.error(err);
    }
  };

  const likeComment = async (comment) => {
      if (!user) {
        console.log("User not logged in");
        navigation.navigate("login");
        return;
      }
    
      const updatedComments = comments.map((c) => {
        if (c._id === comment._id) {
          let updatedLikes;
    
          if (c.likes.includes(user.email)) {
            updatedLikes = c.likes.filter((email) => email !== user.email);
          } else {
            updatedLikes = [...c.likes, user.email];
          }
    
          return { ...c, likes: updatedLikes }; 
        }
        return c;
      });
    
      setComments(updatedComments);
    
      try {
        const updatedComment = updatedComments.find((c) => c._id === comment._id);
        const filters = { comment: comment._id, likes: updatedComment.likes };
        await CommentLikes(filters);
      } catch (err) {
        console.error(err);
      }
    };


  const getPostLike = (post) => {
    if(!user) {
      return postUnliked;
    }
    else if(post.likes.includes(user.email)) {
      return postLiked;
    }
    else {
      return postUnliked;
    }
  }

  const getCommentLike = (comment) => {
    if(!user) {
      return unliked;
    }
    else if(comment.likes.includes(user.email)) {
      return liked;
    }
    else {
      return unliked;
    }
  }

  const printComments = (comments) => {
    return (
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <PostCard>
            <GeneralText>{item.content}</GeneralText>
            <GeneralText>Author: {item.author}</GeneralText>
            <TouchableOpacity onPress={() => likeComment(item)}>{getCommentLike(item)}</TouchableOpacity>
            <GeneralText>         {item.likes.length}</GeneralText>
          </PostCard>
        )}
        keyExtractor={(item) => item._id}
      />
    )
  }

  return (
    <Container>
      <ThreadName>{post.threadName}</ThreadName>
      <GeneralText style={IndexStyles.postContent}>
        {post.content}
      </GeneralText>
      <GeneralText style={IndexStyles.author}>
        Author: {post.author}
      </GeneralText>
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity onPress={() => likePost(post)}>{getPostLike(post)}</TouchableOpacity>
        <GeneralText>  {post.likes.length}  </GeneralText>

        <TouchableOpacity><Icon name="message1" size={25}/></TouchableOpacity>
        <GeneralText>  {post.comments.length}  </GeneralText>
      </View>
      <Header>Comments</Header>
      <View style={{flexDirection: "row"}}>
      <TextInput
          onChangeText={onChangeText}
          value={text}
          placeholder="Add a comment"
        />
        <TouchableOpacity onPress={() => addComment(post)}>
          <Icon name="plus" size={25}/>
        </TouchableOpacity>
      </View>
      {printComments(comments)}
    </Container>
  );
};

export default PostPage;
