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
import { createPost } from "./services/postService";

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

      const postData = await createPost(IP, selectedThread, body, user.email);
      // Handle postData if needed
      navigation.navigate("post", {
        postID: postData._id,
        threadName: postData.threadName,
      });
    } catch (error) {
      console.error("Error in makePost component:", error);
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
