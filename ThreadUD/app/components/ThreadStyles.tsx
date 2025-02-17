import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const Container = ({ children }) => (
  <View className="flex-1 p-2" style={{ backgroundColor: "#3a4b5c" }}>
    {children}
  </View>
);

export const Header = ({ children }) => (
  <View
    className="p-4 flex-row justify-between items-center"
    style={{ backgroundColor: "#1a2b61" }}
  >
    {children}
  </View>
);

export const HeaderText = ({ children }) => (
  <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
    {children}
  </Text>
);

export const JoinButton = ({ onPress, joined }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: joined ? "grey" : "red",
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    }}
  >
    <Text style={{ color: "white", fontWeight: "bold" }}>
      {joined ? "Joined" : "Join"}
    </Text>
  </TouchableOpacity>
);

export const PostCard = ({ children }) => (
  <View
    className="p-4 my-2 rounded-lg shadow-md"
    style={{ backgroundColor: "#0d0430" }}
  >
    {children}
  </View>
);

export const Author = ({ children }) => (
  <Text className="font-bold text-lg text-white">{children}</Text>
);

export const Timestamp = ({ children }) => (
  <Text className="text-gray-500 text-sm">{children}</Text>
);

export const Content = ({ children }) => (
  <Text className="my-2 text-base leading-5 text-white">{children}</Text>
);

export const ButtonContainer = ({ children }) => (
  <View className="mt-4 flex-row items-center">{children}</View>
);

export const Button = ({ onPress, title, style }) => (
  <TouchableOpacity
    className={`bg-blue-500 p-4 rounded-lg items-center my-2 ${style}`}
    onPress={onPress}
  >
    <Text className="text-white font-bold">{title}</Text>
  </TouchableOpacity>
);
