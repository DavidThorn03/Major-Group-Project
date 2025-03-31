import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import {
  Container,
  PostCard,
  CommentCard,
  ThreadName,
  Timestamp,
  GeneralText,
  PostContent,
  Author,
  Button,
  Button2,
  CommentInput,
  CommentHeader,
  ListFooterSpace,
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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import IP from "../config/IPAddress.js";
import BottomNavBar from "./components/BottomNavBar";
import NavBar from "./components/NavBar";

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
  const postUnliked = <Icon name="hearto" size={25} color="white" />;
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
      const newSocket = io(IP, {
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
      socket.disconnect();
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
        post: post._id,
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
      socket.disconnect();
      navigation.navigate("login");
      return;
    } else if (text.trim() === "") {
      onChangeText("");
      Alert.alert("Error", "Comment cannot be empty.");
      return;
    }
    setInput(false);
    onChangeText("");
    let newComment = { content: text, author: user.email };

    try {
      const commentFilters = { comment: newComment, author: user.email };
      const postFilters = { post: post._id, action: 1 };
      const response = await AddComment(commentFilters, postFilters);
      if (response.flagged) {
        Alert.alert(
          "Commment flagged",
          "Your comment was flagged as inappropriate and may not be added."
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const likeComment = async (comment) => {
    if (!user) {
      socket.disconnect();
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
      socket.disconnect();
      navigation.navigate("login");
      return;
    } else if (text.trim() === "") {
      onChangeText("");
      Alert.alert("Error", "Reply cannot be empty.");
      return;
    }

    try {
      const reply = { content: text, author: user.email };
      const filter = { comment: reply, _id: comment._id, action: 1 };
      setInput(false);
      onChangeText("");
      const response = await AddReply(filter);
      if (response.flagged) {
        Alert.alert(
          "Reply flagged",
          "Your reply was flagged as inappropriate and may not be added."
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (comment, parent) => {
    if (!user) {
      socket.disconnect();
      navigation.navigate("login");
      return;
    } else if (comment.author !== user.email) {
      return;
    }
    if (parent === null) {
      try {
        const filter = {
          comment: comment._id,
          action: -1,
          post: post._id,
          replies: comment.replyid,
        };
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

  const navigateToThread = () => {
    socket.disconnect();
    navigation.navigate("thread", {
      threadID: post.threadID,
      threadName: post.threadName,
    });
  };

  const printComments = (comments, comment) => {
    return (
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <CommentCard>
            <Timestamp>{dayjs(item.createdAt).fromNow()}</Timestamp>
            <GeneralText>{item.content}</GeneralText>
            <Author>{item.author.split("@")[0]}</Author>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => likeComment(item)}>
                {getCommentLike(item)}
              </TouchableOpacity>
              <GeneralText> {item.likes.length} </GeneralText>
              <View style={{ paddingHorizontal: 4 }} />
              {!comment && (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => enterReply(item)}>
                    <Icon name="message1" size={25} color="white" />
                  </TouchableOpacity>
                  <GeneralText> {item.replyid.length} </GeneralText>
                </View>
              )}
              {user && item.author === user.email && (
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
                <Button2
                  title="Hide Replies"
                  onPress={() => hideReplies(item)}
                />
              </View>
            )}
          </CommentCard>
        )}
        keyExtractor={(item) => item._id}
      />
    );
  };

  return (
    <Container>
      <NavBar />
      <PostCard>
        <TouchableOpacity onPress={() => navigateToThread()}>
          <ThreadName>{post.threadName}</ThreadName>
        </TouchableOpacity>
        <Timestamp>{dayjs(post.createdAt).fromNow()}</Timestamp>
        <GeneralText>{post.content}</GeneralText>
        <Author>{post.author.split("@")[0]}</Author>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => likePost()}>
            {getPostLike()}
          </TouchableOpacity>
          <GeneralText> {post.likes ? post.likes.length : 0} </GeneralText>
          <View style={{ paddingHorizontal: 4 }} />
          <TouchableOpacity onPress={() => commentInput()}>
            <Icon name="message1" size={25} color="white" />
          </TouchableOpacity>
          <GeneralText>
            {" "}
            {post.comments ? post.comments.length : 0}{" "}
          </GeneralText>
        </View>
      </PostCard>
      <CommentHeader>Comments</CommentHeader>
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
      <FlatList
        data={comments}
        renderItem={({ item }) => printComments([item], null)}
        keyExtractor={(item) => item._id}
        ListFooterComponent={<ListFooterSpace />}
      />
      <BottomNavBar />
    </Container>
  );
};

export default PostPage;
