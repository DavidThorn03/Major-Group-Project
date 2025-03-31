import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const Container = ({ children }) => (
  <View
    style={{
      flex: 1,
      padding: 10,
      paddingTop: 64,
      backgroundColor: "#3a4b5c",
    }}
  >
    {children}
  </View>
);

export const Header = ({ children }) => (
  <Text className="text-2xl font-bold mb-4 text-center text-white">
    {children}
  </Text>
);

export const PostCard = ({ children }) => (
  <View
    style={{
      backgroundColor: "#0d0430",
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }}
  >
    {children}
  </View>
);

export const ThreadName = ({ children }) => (
  <Text className="text-2xl font-bold text-white">{children}</Text>
);

export const Timestamp = ({ children }) => (
  <Text className="text-gray-500 text-xs mb-2">{children}</Text>
);

export const Author = ({ children }) => (
  <Text
    className="text-sm mb-3 mt-1"
    style={{ fontSize: 13, color: "green", opacity: 0.7 }}
  >
    {children}
  </Text>
);

export const PostContent = ({ children }) => (
  <Text className="text-base text-white">{children}</Text>
);

export const ButtonContainer = ({ children }) => (
  <View className="mt-4 items-center">{children}</View>
);

export const GeneralText = ({ children }) => (
  <Text className="text-base text-white">{children}</Text>
);

export const Button = ({ onPress, title, style }) => (
  <TouchableOpacity
    className={`bg-blue-500 p-4 rounded-lg items-center my-2 ${style}`}
    onPress={onPress}
  >
    <Text className="text-white font-bold">{title}</Text>
  </TouchableOpacity>
);

export const ListFooterSpace = () => <View style={{ height: 63 }} />;
