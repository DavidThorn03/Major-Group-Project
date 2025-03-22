import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Header,
  HeaderText,
  Container,
  ThreadName,
  GeneralText,
  Input,
  PostCard,
  SubtitleText,
} from "./components/SearchStyles";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { searchThreads } from "./services/searchThreads";
import { getThreads } from "./services/getThreads";
import BottomNavBar from "./components/BottomNavBar";

const SearchPage = () => {
  const navigation = useNavigation();
  const [threads, setThreads] = useState([]);
  const [text, onChangeText] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [userSearched, setUserSearched] = useState(false);
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
      setUserSearched(true);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (text.length > 2) {
      const fetchData = async () => {
        try {
          const response = await searchThreads({ name: text });
          if (!response || response.length === 0) {
            setError("No threads found.");
            setThreads([]);
          } else {
            setError(null);
            setThreads(response);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchData();
    } else if (user && user.threads && user.threads.length > 0) {
      const fetchData = async () => {
        try {
          const filter = { threadIDs: user.threads };
          const response = await getThreads(filter);
          if (!response || response.length === 0) {
            setError("No threads found.");
            setThreads([]);
          } else {
            setError(null);
            setThreads(response);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      fetchData();
    } else {
      setThreads([]);
      setError("Enter thread to be searched.");
    }
  }, [text, userSearched]);

  const displayThread = (thread) => {
    return (
      <PostCard>
        <TouchableOpacity
          onPress={() => navigateToThread(thread._id, thread.threadName)}
        >
          <ThreadName>{thread.threadName}</ThreadName>
          <GeneralText>Year: {thread.year}</GeneralText>
          <GeneralText>Course: {thread.course}</GeneralText>
        </TouchableOpacity>
      </PostCard>
    );
  };

  const navigateToThread = (threadID, threadName) => {
    console.log("Navigating to thread with:", { threadID, threadName });
    navigation.navigate("thread", { threadID, threadName });
  };

  return (
    <Container>
      <Header>
        <HeaderText>Search for a Thread</HeaderText>
      </Header>
      <SubtitleText>Search by Thread Name or Course Code</SubtitleText>
      <View style={{ flexDirection: "row" }}>
        <Input
          onChangeText={onChangeText}
          value={text}
          placeholder="Search..."
          autoFocus={true}
        />
      </View>
      {error && <GeneralText>{error}</GeneralText>}
      {!threads && userSearched && <GeneralText>No threads found.</GeneralText>}
      {threads.length > 0 && (
        <FlatList
          data={threads}
          renderItem={({ item }) => displayThread(item)}
          keyExtractor={(item) => item._id}
        />
      )}
      <BottomNavBar />
    </Container>
  );
};

export default SearchPage;
