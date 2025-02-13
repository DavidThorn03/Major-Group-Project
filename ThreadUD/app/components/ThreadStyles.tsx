import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const Container = ({ children }) => (
  <View className="flex-1 bg-gray-200 p-2">{children}</View>
);

export const Header = ({ children }) => (
  <View className="bg-blue-600 p-4 flex-row justify-between items-center">
    <Text className="text-white text-xl font-bold">{children}</Text>
  </View>
);

export const PostCard = ({ children }) => (
  <View className="bg-blue-300 p-4 my-2 rounded-lg shadow-md">{children}</View>
);

export const Author = ({ children }) => (
  <Text className="font-bold text-lg">{children}</Text>
);

export const Timestamp = ({ children }) => (
  <Text className="text-gray-500 text-sm">{children}</Text>
);

export const Content = ({ children }) => (
  <Text className="my-2 text-base leading-5">{children}</Text>
);

export const ButtonContainer = ({ children }) => (
  <View className="mt-4 items-center">{children}</View>
);

export const Button = ({ onPress, title, style }) => (
  <TouchableOpacity
    className={`bg-blue-500 p-4 rounded-lg items-center my-2 ${style}`}
    onPress={onPress}
  >
    <Text className="text-white font-bold">{title}</Text>
  </TouchableOpacity>
);
