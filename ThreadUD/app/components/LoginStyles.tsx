import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const Container = ({ children }) => (
  <View className="flex-1 p-4 bg-gray-100">{children}</View>
);

export const Header = ({ children }) => (
  <Text className="text-2xl font-bold mb-4 text-center">{children}</Text>
);

export const Input = (props) => (
  <TextInput
    {...props}
    className="h-10 border border-gray-300 mb-4 px-2 rounded"
  />
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
