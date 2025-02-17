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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { Likes } from "./services/updateLikes";
import { CommentLikes } from "./services/updateCommentLikes";
import { getComments } from "./services/getComments";
import { AddComment } from "./services/addComment";
import { AddReply } from "./services/addReply";
import { getSinglePost } from "./services/getSinglePost";
import { RemoveComment } from "./services/removeComment";
import { RemoveReply } from "./services/removeReply";
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

  const postLiked = <Icon name="heart" size={25} color="red" />;
  const postUnliked = <Icon name="hearto" size={25} color="red" />;
  const liked = <Icon name="heart" size={15} color="red" />;
  const unliked = <Icon name="hearto" size={15} color="red" />;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        console.log("Raw user data:", userData);
        if (userData) {
          try {
            const parsedUserData = JSON.parse(userData);
            setUser(parsedUserData);
            console.log("Parsed user data:", parsedUserData);
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
          }
        } else {
          console.log("No user data found");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await AsyncStorage.getItem("Post");
        console.log("Raw post data:", postData);
        if (postData) {
          try {
            const parsedPostData = JSON.parse(postData);
            const post = await getSinglePost({ id: parsedPostData.id });
            post.threadName = parsedPostData.threadName;
            setPost(post);
            setPostsearched(true);
          } catch (parseError) {
            console.error("Error parsing post data:", parseError);
          }
        } else {
          console.log("No post data found");
          setPost(null);
        }
      } catch (err) {
        console.error("Error fetching post data:", err);
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
      console.log("Setting up socket connection for post:", post._id);

      if (socket) {
        console.log(
          "Disconnecting previous socket before setting up a new one"
        );
        socket.disconnect();
      }

      const newSocket = io("http://192.168.1.17:3000/", {
        query: { post: post._id },
      });

      newSocket.on("update comments", (updatedComments) => {
        console.log("Received updated comments:", updatedComments);
        setComments(updatedComments);
      });

      setSocket(newSocket);

      return () => {
        console.log("Disconnecting socket for post:", post._id);
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
      const commentFilters = { comment: newComment };
      const postFilters = { post: post._id, action: 1 };
      console.log("Adding comment ");
      const newID = await AddComment(commentFilters, postFilters);
      const updatedCommentsIDs = [...post.comments, newID];
      const updatedPost = { ...post, comments: updatedCommentsIDs };
      setPost(updatedPost);

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
    }
    if (post.likes.includes(user.email)) {
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
      console.log("Adding comment ");
      const newID = await AddReply(filter);
      console.log("Comment added");
      setInput(false);
      onChangeText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (comment, parent) => {
    if (!user) {
      console.log("User not logged in");
      navigation.navigate("login");
      return;
    } else if (comment.author !== user.email) {
      console.log("User not authorized to delete comment");
      return;
    }
    if (parent === null) {
      try {
        const filter = { comment: comment._id, action: -1, post: post._id };
        console.log("Deleting comment ");
        await RemoveComment(filter);
        console.log("Comment deleted");
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
        console.log("Deleting reply ");
        await RemoveReply(filter);
        console.log("Reply deleted");
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

  const printComments = (comments) => {
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
                <TouchableOpacity onPress={() => deleteComment(item, null)}>
                  <Icon name="delete" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
            {item.replyInput && (
              <View style={{ flexDirection: "row" }}>
                <TextInput
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
                {printComments(item.replies)}
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
      <PostContent>{post.content}</PostContent>
      <Author>Author: {post.author}</Author>
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
          <TouchableOpacity onPress={() => addComment(post)}>
            <Icon name="plus" size={25} />
          </TouchableOpacity>
        </View>
      )}
      {printComments(comments)}
      <Button title="Back" onPress={() => navigation.navigate("index")} />
    </Container>
  );
};

export default PostPage;
