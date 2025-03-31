import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const Container = ({ children }) => (
  <View
    className="flex-1 p-2"
    style={{ backgroundColor: "#3a4b5c", paddingTop: 70 }}
  >
    {children}
  </View>
);

export const Header = ({ children }) => (
  <View
    className="flex-row justify-between items-center"
    style={{
      backgroundColor: "#1a2b61",
      marginBottom: 14,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 64,
    }}
  >
    {children}
  </View>
);

export const HeaderText = ({ children }) => (
  <View style={{ alignItems: "center" }}>
    <Text
      style={{
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        paddingLeft: 16,
      }}
    >
      {children}
    </Text>
  </View>
);

export const JoinButton = ({ onPress, joined }) => (
  <View style={{ paddingRight: 17 }}>
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: joined ? "grey" : "red",
        padding: 11,
        borderRadius: 5,
        marginLeft: 10,
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        {joined ? "Joined" : "Join"}
      </Text>
    </TouchableOpacity>
  </View>
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
  <Text className="font-bold text-lg text-white" style={{ color: "green" }}>
    {children}
  </Text>
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

export const ListFooterSpace = () => <View style={{ height: 63 }} />;
