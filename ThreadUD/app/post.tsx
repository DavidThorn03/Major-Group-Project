import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  Container,
  PostCard,
  ThreadName,
  Timestamp,
  GeneralText,
  PostContent,
  Author,
  Button,
  CommentInput,
} from "./components/PostStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { Likes } from "./services/updateLikes";
import { CommentLikes } from "./services/updateCommentLikes";
import { getComments } from "./services/getComments";
import { AddComment } from "./services/addComment";
import { AddReply } from "./services/addReply";
import { getSinglePost } from "./services/getSinglePost.js";
import { RemoveComment } from "./services/removeComment";
import { RemoveReply } from "./services/removeReply.js";
import io from "socket.io-client";

const PostPage = () => {
  const navigation = useNavigation();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [postSearched, setPostsearched] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, onChangeText] = useState("");
  const [input, setInput] = useState(false);
  const [socket, setSocket] = useState(null);
  const route = useRoute();
  const { postID, threadName } = route.params || {};	

  const postLiked = <Icon name="heart" size={25} color="red" />;
  const postUnliked = <Icon name="hearto" size={25} color="red" />;
  const liked = <Icon name="heart" size={15} color="red" />;
  const unliked = <Icon name="hearto" size={15} color="red" />;

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      
      console.log("Fetching post with ID:", postID);
      try {
          const post = await getSinglePost({ id: postID });
          post.threadName = threadName;
          setPost(post);
          setPostsearched(true);
        
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
          const commentData = await getComments({ id: post.comments });
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
    if (postSearched && post?._id) {
      if (socket) {
        socket.disconnect();
      }

      const newSocket = io("http://192.168.0.11:3000/", {
        query: { post: post._id },
      });

      newSocket.on("update comments", (updatedComments) => {
        setComments(updatedComments);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [postSearched, post?._id]);

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
      navigation.navigate("login");
      return;
    }
    let action;
    let updatedLikes;

    if (post.likes.includes(user.email)) {
      action = -1;
      updatedLikes = post.likes.filter((email) => email !== user.email);
    } else {
      action = 1;
      updatedLikes = [...post.likes, user.email];
    }

    setPost({ ...post, likes: updatedLikes });
    try {
      const filters = {
        post: post.postTitle,
        like: user.email,
        action: action,
      };
      await Likes(filters);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async () => {
    if (!user) {
      navigation.navigate("login");
      return;
    } else if (text === "") {
      return;
    }
    let newComment = { content: text, author: user.email };

    try {
      const commentFilters = { comment: newComment, author: user.email };
      const postFilters = { post: post._id, action: 1 };
      const newID = await AddComment(commentFilters, postFilters);
      const updatedCommentsIDs = [...post.comments, newID];
      const updatedPost = { ...post, comments: updatedCommentsIDs };
      setPost(updatedPost);

      setInput(false);
      onChangeText("");
    } catch (err) {
      console.error(err);
    }
  };

  const likeComment = async (comment) => {
    if (!user) {
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
      const filters = {
        comment: comment._id,
        like: user.email,
        action: action,
      };
      await CommentLikes(filters);
    } catch (err) {
      console.error(err);
    }
  };

  const getPostLike = () => {
    if (!user) {
      return postUnliked;
    } else if (post.likes.includes(user.email)) {
      return postLiked;
    } else {
      return postUnliked;
    }
  };

  const getCommentLike = (comment) => {
    if (!user) {
      return unliked;
    } else if (comment.likes.includes(user.email)) {
      return liked;
    } else {
      return unliked;
    }
  };

  const getReplies = async (comment) => {
    const replies = await getComments({ id: comment.replyid });
    const updatedComments = comments.map((c) => {
      if (c._id === comment._id) {
        c.replies = replies;
      }
      return c;
    });
    setComments(updatedComments);
  };

  const hideReplies = (comment) => {
    const updatedComments = comments.map((c) => {
      if (c._id === comment._id) {
        c.replies = null;
      }
      return c;
    });
    setComments(updatedComments);
  };

  const commentInput = () => {
    setInput(!input);
  };

  const reply = async (comment) => {
    if (!user) {
      navigation.navigate("login");
      return;
    } else if (text === "") {
      return;
    }

    try {
      const reply = { content: text, author: user.email };
      const filter = { comment: reply, _id: comment._id, action: 1 };
      const newID = await AddReply(filter);
      setInput(false);
      onChangeText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (comment, parent) => {
    if (!user) {
      navigation.navigate("login");
      return;
    } else if (comment.author !== user.email) {
      return;
    }
    if (parent === null) {
      try {
        const filter = { comment: comment._id, action: -1, post: post._id };
        await RemoveComment(filter);
      } catch (err) {
        console.error(err);
      }
      const updatedCommentIDs = post.comments.filter(
        (id) => id !== comment._id
      );
      const updatedPost = { ...post, comments: updatedCommentIDs };
      setPost(updatedPost);
    } else {
      try {
        const filter = { reply_id: comment._id, action: -1, _id: parent._id };
        await RemoveReply(filter);
      } catch (err) {
        console.error(err);
      }
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
  };

  const printComments = (comments, comment) => {
    return (
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <PostCard>
            <GeneralText>{item.content}</GeneralText>
            <GeneralText>Author: {item.author}</GeneralText>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => likeComment(item)}>
                {getCommentLike(item)}
              </TouchableOpacity>
              <GeneralText> {item.likes.length} </GeneralText>
              <TouchableOpacity onPress={() => enterReply(item)}>
                <Icon name="message1" size={15} />
              </TouchableOpacity>
              <GeneralText> {item.replyid.length} </GeneralText>
              {item.author === user.email && (
                <TouchableOpacity onPress={() => deleteComment(item, comment)}>
                  <Icon name="delete" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
            {item.replyInput && (
              <View style={{ flexDirection: "row" }}>
                <CommentInput
                  onChangeText={onChangeText}
                  value={text}
                  placeholder="Reply to comment"
                  autoFocus={true}
                />
                <TouchableOpacity onPress={() => reply(item)}>
                  <Icon name="plus" size={25} />
                </TouchableOpacity>
              </View>
            )}
            {item.replyid.length > 0 && !item.replies && (
              <Button title="View Replies" onPress={() => getReplies(item)} />
            )}
            {item.replies && (
              <View>
                {printComments(item.replies, item)}
                <Button
                  title="Hide Replies"
                  onPress={() => hideReplies(item)}
                />
              </View>
            )}
          </PostCard>
        )}
        keyExtractor={(item) => item._id}
      />
    );
  };

  return (
    <Container>
      <GeneralText>{post.threadName}</GeneralText>
      <ThreadName>{post.postTitle}</ThreadName>
      <GeneralText>{post.content}</GeneralText>
      <GeneralText>Author: {post.author}</GeneralText>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => likePost()}>
          {getPostLike()}
        </TouchableOpacity>
        <GeneralText> {post.likes ? post.likes.length : 0} </GeneralText>

        <TouchableOpacity onPress={() => commentInput()}>
          <Icon name="message1" size={25} />
        </TouchableOpacity>
        <GeneralText> {post.comments ? post.comments.length : 0} </GeneralText>
      </View>
      <GeneralText>Comments</GeneralText>
      {input && (
        <View style={{ flexDirection: "row" }}>
          <CommentInput
            onChangeText={onChangeText}
            value={text}
            placeholder="Add a comment"
            autoFocus={true}
          />
          <TouchableOpacity onPress={() => addComment()}>
            <Icon name="plus" size={25} />
          </TouchableOpacity>
        </View>
      )}
      {printComments(comments, null)}
      <Button title="Back" onPress={() => navigation.navigate("index")} />
    </Container>
  );
};

export default PostPage;
