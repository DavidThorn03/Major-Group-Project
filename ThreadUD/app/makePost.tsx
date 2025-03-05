import React, { useState, useEffect } from "react";
import { Alert, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import axios from "axios";
import IP from "../config/IPAddress.js";
import {
  Container,
  CloseButton,
  StyledPicker,
  StyledTextInput,
  PostButton,
} from "./components/MakePostStyles";
import { Picker } from "@react-native-picker/picker";

const MakePostPage = () => {
  const navigation = useNavigation();
  const [body, setBody] = useState("");
  const [selectedThread, setSelectedThread] = useState("");
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const user = await AsyncStorage.getItem("User");
        if (user) {

          // user.threads should be an array of thread IDs
          if (Array.isArray(user.threads) && user.threads.length > 0) {
            const response = await axios.post(`${IP}/thread/multiple`, {
              threadIDs: user.threads,
            });
            const validThreads = response.data.map((thread: any) => ({
              threadID: thread._id,
              threadName: thread.threadName,
            }));
            setThreads(validThreads);
          }
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []);

  const handlePost = async () => {
    if (!selectedThread || !body) {
      Alert.alert("Error", "Please select a thread and enter some text.");
      return;
    }

    try {
      const user = await AsyncStorage.getItem("User");
      if (!user) {
        console.error("User data not found in AsyncStorage");
        return;
      }

      // Make the POST request to create a new post
      const response = await axios.post(
        `${API_URL}/thread/${selectedThread}/posts`,
        {
          content: body,
          author: user.email,
        }
      );

      if (response.status === 201) {
        const newPost = response.data;
        // Optionally store the newly created post or navigate
        navigation.navigate("post", {postID: newPost._id, threadName: newPost.threadName});
      } else {
        Alert.alert("Error", "Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "An error occurred while creating the post.");
    }
  };

  return (
    <Container>
      <CloseButton onPress={() => navigation.goBack()} />

      {/* Drop-down (Picker) */}
      <StyledPicker
        selectedValue={selectedThread}
        onValueChange={(itemValue) => setSelectedThread(itemValue)}
      >
        <Picker.Item label="Select a thread..." value="" />
        {threads.map((thread) => (
          <Picker.Item
            key={thread.threadID}
            label={thread.threadName || "Unnamed Thread"}
            value={thread.threadID}
          />
        ))}
      </StyledPicker>

      <StyledTextInput
        onChangeText={setBody}
        value={body}
        placeholder="Enter post content"
      />

      <PostButton onPress={handlePost} />
    </Container>
  );
};

export default MakePostPage;
