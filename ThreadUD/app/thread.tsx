import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getPostsByThread } from "./services/getThreadPosts.js";
import { useRoute } from "@react-navigation/native";

const Thread = () => {
  const route = useRoute();
  const { threadId, threadName } = route.params;
  const [posts, setPosts] = useState([]);
  const [joined, setJoined] = useState(false); // Placeholder for join feature

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPostsByThread(threadId);
      setPosts(data);
    };
    fetchPosts();
  }, [threadId]);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Thread Header */}
      <View className="p-4 bg-blue-500 flex-row justify-between items-center">
        <Text className="text-white text-lg font-bold">{threadName}</Text>
        {!joined && (
          <TouchableOpacity
            onPress={() => setJoined(true)}
            className="p-2 bg-white rounded"
          >
            <Text className="text-blue-500">Join Thread</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Post List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-300">
            <Text className="font-bold">{item.author}</Text>
            <Text className="text-gray-600">
              {new Date(item.createdAt).toLocaleString()}
            </Text>
            <Text className="text-gray-800 mt-2">{item.content}</Text>
            <TouchableOpacity className="mt-2 p-1 bg-gray-200 rounded">
              <Text className="text-blue-500">Like ({item.likes.length})</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Thread;
