import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "./constants/apiConfig";
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
        const userData = await AsyncStorage.getItem("User");
        if (userData) {
          const user = JSON.parse(userData);
          console.log("User threads raw data:", user.threads);

          const threadsData = user.threads.map((thread) => ({
            threadID: thread.threadID || thread._id,
            threadName: thread.threadName || thread.name,
          }));

          console.log("Mapped threads data:", threadsData);
          setThreads(threadsData);
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
      const userData = await AsyncStorage.getItem("User");
      if (!userData) {
        console.error("User data not found in AsyncStorage");
        return;
      }
      const user = JSON.parse(userData);

      const response = await axios.post(
        `${API_URL}/thread/${selectedThread}/posts`,
        {
          postTitle: "New Post",
          content: body,
          author: user.email,
        }
      );

      if (response.status === 201) {
        const newPost = response.data;
        await AsyncStorage.setItem("Post", JSON.stringify(newPost));
        navigation.navigate("post");
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
      <StyledPicker
        selectedValue={selectedThread}
        onValueChange={(itemValue) => setSelectedThread(itemValue)}
      >
        {threads.map((thread, index) => (
          <Picker.Item
            key={
              thread.threadID ? thread.threadID.toString() : `thread-${index}`
            }
            label={thread.threadName ? thread.threadName : "Unnamed Thread"}
            value={thread.threadID}
          />
        ))}
      </StyledPicker>
      <StyledTextInput onChangeText={setBody} value={body} />
      <PostButton onPress={handlePost} />
    </Container>
  );
};

export default MakePostPage;
