import React, { useEffect, useState } from "react";
import { FlatList, View, TextInput } from "react-native";
import {
  Container,
  Header,
  PostCard,
  ThreadName,
  GeneralText,
  Button
} from "./components/StyledWrappers";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import {Likes} from "./services/updateLikes";
import {CommentLikes} from "./services/updateCommentLikes";
import {getComments} from "./services/getComments";
import {AddComment} from "./services/addComment";
import {AddReply} from "./services/addReply";
import {getSinglePost} from "./services/getSinglePost";
import IndexStyles from "./styles/IndexStyles";
import io from "socket.io-client";

const PostPage = () => {
  const navigation = useNavigation();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [postSearched, setPostsearched] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, onChangeText] = useState("");
  const [input, setInput] = useState(false)

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
          const post = await getSinglePost( { id: postData._id } );
          post.threadName = postData.threadName;
          setPost(post);
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

  useEffect(() => {
    if (postSearched && post._id) {  // Ensure post._id exists
      console.log('Setting up socket connection...');
      
      const socket = io("http://192.168.0.11:3000/", {
        query: { post: post._id }, 
      });
  
      console.log("Post ID: ", post._id);
      
      socket.on('update comments', (updatedComments) => {
        console.log('Received updated comments:', updatedComments); 
        setComments(updatedComments);
      });
  
      return () => {
        socket.disconnect();
        console.log('Socket disconnected');
      };
    }
  }, [postSearched, post._id]); // Include post._id in dependencies
  


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

  const likePost = async () => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }
    let action;
  
    if (post.likes.includes(user.email)) {
      action = -1;
      updatedLikes = post.likes.filter((email) => email !== user.email);
    } else {
      action = 1;
      updatedLikes = [...post.likes, user.email];
    }
  
    setPost({ ...post, likes: updatedLikes });
  
    try {
      const filters = { post: post.postTitle, like: user.email, action: action };
      await Likes(filters);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async () => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }
    else if (text === "") {
      console.log("No comment entered");
      return;
    }
    let newComment = { content: text, author: user.email };
  
    try {
      const commentFilters = { comment: newComment };
      const postFilters = { post: post.postTitle, action: 1 };
      console.log("Adding comment ");
      const newID = await AddComment(commentFilters, postFilters); 
      console.log("Comment added");
      setInput(false);
      onChangeText("");
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
    let action;
  
    if (comment.likes.includes(user.email)) {
      action = -1;
    } else {
      action = 1;
    }
  
  
    try {
      const filters = { comment: comment._id, like: user.email, action: action };
      await CommentLikes(filters);
    } catch (err) {
      console.error(err);
    }
  };



  const getPostLike = () => {
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

  const getReplies = async (comment) => {
    const replies = await getComments( { id: comment.replyid } );
    const updatedComments = comments.map((c) => {
      if (c._id === comment._id) {
  
        c.replies = replies;
      }
      return c;
    });
    setComments(updatedComments);
    console.log("Updated comments: ", comments);
  }

  const hideReplies = (comment) => {
    const updatedComments = comments.map((c) => {
      if (c._id === comment._id) {
        c.replies = null;
      }
      return c;
    });
    setComments(updatedComments);
  }

  const commentInput = () => {
    setInput(!input);
  }

  const reply = async (comment) => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    }
    else if (text === "") {
      console.log("No comment entered");
      return;
    }
  
    try {
      const filter = { content: text, author: user.email, _id: comment._id, action: 1 };
      console.log("Adding comment "); 
      const newID = await AddReply(filter); 
      console.log("Comment added");
      setInput(false);
      onChangeText("");
    } catch (err) {
      console.error(err);
    }
  };

  const enterReply = (comment) => {
    comment.replyInput = true;
    const updatedComments = comments.map((c) => { 
      if (c._id === comment._id) {
  
        c.replyInput = true;
      }
      return c;
    });
    setComments(updatedComments);
  }

  const printComments = (comments, comment) => {
    return (
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <PostCard>
            <GeneralText>{item.content}</GeneralText>
            <GeneralText>Author: {item.author}</GeneralText>
            <View style={{flexDirection: "row"}}>
            <TouchableOpacity onPress={() => likeComment(item)}>{getCommentLike(item)}</TouchableOpacity>
            <GeneralText> {item.likes.length}   </GeneralText>
            <TouchableOpacity onPress={() => enterReply(item)}><Icon name="message1" size={15}/></TouchableOpacity>
            <GeneralText> {item.replyid.length}  </GeneralText>
            </View>
            {item.replyInput && 
            <View style={{flexDirection: "row"}}>
            <TextInput 
                onChangeText={onChangeText}
                value={text}
                placeholder="Reply to comment"
                autoFocus={true}
              />
              <TouchableOpacity onPress={() => reply(item)}>
                <Icon name="plus" size={25}/>
              </TouchableOpacity>
              </View>
            }
            {(item.replyid.length > 0 && !item.replies) && 
            <Button title="View Replies" onPress={() => getReplies(item)} />
            }
            {item.replies && 
              <View>
              {printComments(item.replies, item)}
              <Button title="Hide Replies" onPress={() => hideReplies(item)} />
              </View>
            }
          </PostCard>
        )}
        keyExtractor={(item) => item._id}
      />
    )
  }

  return (
    <Container>
      <GeneralText>{post.threadName}</GeneralText>
      <ThreadName>{post.postTitle}</ThreadName>
      <GeneralText style={IndexStyles.postContent}>
        {post.content}
      </GeneralText>
      <GeneralText style={IndexStyles.author}>
        Author: {post.author}
      </GeneralText>
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity onPress={() => likePost(post)}>{getPostLike(post)}</TouchableOpacity>
        <GeneralText>  {post.likes.length}  </GeneralText>

        <TouchableOpacity onPress={() => commentInput()}><Icon name="message1" size={25}/></TouchableOpacity>
        <GeneralText>  {post.comments.length}  </GeneralText>
      </View>
      <Header>Comments</Header>
      {input && 
      <View style={{flexDirection: "row"}}>
      <TextInput 
          onChangeText={onChangeText}
          value={text}
          placeholder="Add a comment"
          autoFocus={true}
        />
        <TouchableOpacity onPress={() => addComment(post)}>
          <Icon name="plus" size={25}/>
        </TouchableOpacity>
        </View>
      }
      {printComments(comments, null)}
      <Button title="Back" onPress={() => navigation.navigate("index")} /> 
    </Container>
  );
};

export default PostPage;
