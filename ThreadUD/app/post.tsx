import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
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
  ReplyInput,
  CommentHeader,
  ListFooterSpace,
  DeleteButton,
  ReplyDeleteButton,
  ReplyInputContainer,
  ReplyInputHeader,
  ReplyingToText,
  ReplyInputWrapper,
  ReplySubmitButton,
  BottomNavContainer,
  CommentInputContainer,
  CommentInputWrapper,
} from "./components/PostStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Entypo";
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
  const flatListRef = useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [activeReplyComment, setActiveReplyComment] = useState(null);
  const [showingReply, setShowingReply] = useState({});


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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  const replyVisibility = async (comment) => {
    if (showingReply[comment._id]) {
      setShowingReply((prev) => ({ ...prev, [comment._id]: false }));
    } else {
      await getReplies(comment); 
      setShowingReply((prev) => ({ ...prev, [comment._id]: true }));
    }
  };
  

  const recursiveSearch = async (comment) => {
    if (!comment.replyid || comment.replyid.length === 0) return [];
  
    const replies = await getComments({ id: comment.replyid });
  
    for (let reply of replies) {
      reply.replies = await recursiveSearch(reply);
    }
  
    return replies;
  };
  
  const getReplies = async (comment) => {
    try {
      const nestedReplies = await recursiveSearch(comment);
  
      const updatedComments = comments.map((c) => {
        if (c._id === comment._id) {
          return { ...c, replies: nestedReplies };
        }
        return c;
      });
  
      setComments(updatedComments);
    } catch (err) {
      console.error("Error fetching nested replies:", err);
    }
  };  

  const commentInput = () => {
    setInput(!input);
  };

  const enterReply = (comment) => {
    setActiveReplyComment(comment);
    onChangeText("");
  };

  const dismissReply = () => {
    setActiveReplyComment(null);
    onChangeText("");
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
      setActiveReplyComment(null);
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
              <TouchableOpacity onPress={() => enterReply(item)}>
                <Icon name="message1" size={25} color="white" />
              </TouchableOpacity>
              <GeneralText> {item.replyid.length} </GeneralText>
              {user &&
                item.author === user.email &&
                (comment ? (
                  <ReplyDeleteButton
                    onPress={() => deleteComment(item, comment)}
                  />
                ) : (
                  <DeleteButton onPress={() => deleteComment(item, comment)} />
                ))}
            </View>
  
            {item.replyid.length > 0 && !showingReply[item._id] && (
              <Button title="View Replies" onPress={() => replyVisibility(item)} />
            )}
            
            {showingReply[item._id] && (
              <View>
                {printComments(item.replies, item)}
                <Button2
                  title="Hide Replies"
                  onPress={() => replyVisibility(item)}
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
    >
      <View style={{ flex: 1, backgroundColor: "#3a4b5c" }}>
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
            <CommentInputContainer
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: isKeyboardVisible
                  ? 15
                  : Platform.OS === "ios"
                  ? 25
                  : 10,
              }}
            >
              <ReplyInputHeader>
                <ReplyingToText>
                  Commenting on: {post.author?.split("@")[0]}'s post
                </ReplyingToText>
                <TouchableOpacity onPress={() => setInput(false)}>
                  <Icon name="close" size={20} color="white" />
                </TouchableOpacity>
              </ReplyInputHeader>
              <CommentInputWrapper>
                <CommentInput
                  onChangeText={onChangeText}
                  value={text}
                  placeholder="Add a comment"
                  autoFocus={true}
                />
                <ReplySubmitButton onPress={() => addComment()}>
                  <Icon2 name="reply" size={30} color="green" />
                </ReplySubmitButton>
              </CommentInputWrapper>
            </CommentInputContainer>
          )}
          <FlatList
            ref={flatListRef}
            data={comments}
            renderItem={({ item }) => printComments([item], null)}
            keyExtractor={(item) => item._id}
            ListFooterComponent={<ListFooterSpace />}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToIndex({
                    index: info.index,
                    animated: true,
                    viewPosition: 0.1,
                  });
                }
              });
            }}
          />
        </Container>
        {!isKeyboardVisible && !activeReplyComment && (
          <BottomNavContainer>
            <BottomNavBar />
          </BottomNavContainer>
        )}

        {activeReplyComment && (
          <ReplyInputContainer
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: isKeyboardVisible
                ? 15
                : Platform.OS === "ios"
                ? 25
                : 10,
            }}
          >
            <ReplyInputHeader>
              <ReplyingToText>
                Replying to: {activeReplyComment.author?.split("@")[0]}
              </ReplyingToText>
              <TouchableOpacity onPress={dismissReply}>
                <Icon name="close" size={20} color="white" />
              </TouchableOpacity>
            </ReplyInputHeader>
            <ReplyInputWrapper>
              <ReplyInput
                onChangeText={onChangeText}
                value={text}
                placeholder="Reply to comment"
                autoFocus={true}
                style={{ flex: 1 }}
              />
              <ReplySubmitButton onPress={() => reply(activeReplyComment)}>
                <Icon2 name="reply" size={30} color="green" />
              </ReplySubmitButton>
            </ReplyInputWrapper>
          </ReplyInputContainer>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostPage;
