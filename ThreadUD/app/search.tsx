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
  ListFooterSpace,
} from "./components/SearchStyles";
import Icon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import * as AsyncStorage from "../util/AsyncStorage.js";
import { searchThreads } from "./services/searchThreads";
import { getThreads } from "./services/getThreads";
import { getThreadByCourse } from "./services/getThreadByCourse";
import BottomNavBar from "./components/BottomNavBar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchPage = () => {
  const router = useRouter();
  const [threads, setThreads] = useState([]);
  const [text, onChangeText] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState([]);
  const [userSearched, setUserSearched] = useState(false);
  const regex = /^TU\d{3}$/;

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
    if (regex.test(text.toUpperCase())) {
      const fetchData = async () => {
        try {
          const response = await getThreadByCourse({
            course: text.toUpperCase(),
          });
          if (!response || response.length === 0) {
            setError("No threads found.");
            setThreads([]);
          } else {
            setError("Threads in course " + text.toUpperCase());
            setThreads(response);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchData();
    } else if (text.length > 2) {
      const fetchData = async () => {
        try {
          const response = await searchThreads({ name: text });
          if (!response || response.length === 0) {
            setError("No threads found.");
            setThreads([]);
          } else {
            setError("Threads by name");
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
            setError("Followed threads:");
            setThreads(response);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      fetchData();
    } else if (user && user.course) {
      const fetchData = async () => {
        try {
          const response = await getThreadByCourse({ course: user.course });
          if (!response || response.length === 0) {
            setError("No threads found.");
            setThreads([]);
          } else {
            setError("Threads in your course");
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
    router.push({pathname: "/thread", params: { threadID, threadName }});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
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
      <GeneralText>{error}</GeneralText>
      {!threads && <GeneralText>No threads found.</GeneralText>}
      {threads.length > 0 && (
        <FlatList
          data={threads}
          renderItem={({ item }) => displayThread(item)}
          keyExtractor={(item) => item._id}
          ListFooterComponent={<ListFooterSpace />}
        />
      )}
      <BottomNavBar />
    </Container>
    </SafeAreaView>
  );
};

export default SearchPage;
