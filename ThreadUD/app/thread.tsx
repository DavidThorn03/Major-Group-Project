import React from "react";
import { View, Text, ScrollView } from "react-native";

const Thread = () => {
  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4 bg-blue-500">
        <Text className="text-white text-lg font-bold">Thread Title</Text>
      </View>
      <View className="p-4">
        <Text className="text-gray-800">This is a post about the thread.</Text>
      </View>
    </ScrollView>
  );
};

export default Thread;
