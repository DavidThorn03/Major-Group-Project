import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const Container = ({ children }) => (
  <View className="flex-1 p-4 bg-purple-600">{children}</View>
);

export const Header = ({ children }) => (
  <Text className="text-2xl font-bold mb-5 text-center">{children}</Text>
);

export const Input = (props) => (
  <TextInput
    {...props}
    className="border border-gray-300 rounded-lg p-2 mb-4 text-base bg-white"
  />
);

export const Button = ({ onPress, title, style }) => (
  <TouchableOpacity
    className={`bg-blue-500 p-4 rounded-lg items-center my-2 ${style}`}
    onPress={onPress}
  >
    <Text className="text-white font-bold">{title}</Text>
  </TouchableOpacity>
);
