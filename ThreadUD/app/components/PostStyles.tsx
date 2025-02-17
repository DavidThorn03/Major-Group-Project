import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

export const Container = ({ children }) => (
  <View style={{ flex: 1, padding: 16, backgroundColor: "#23364a" }}>
    {children}
  </View>
);

export const PostCard = ({ children }) => (
  <View
    style={{
      padding: 16,
      marginVertical: 8,
      backgroundColor: "#0d0430",
      borderRadius: 8,
    }}
  >
    {children}
  </View>
);

export const ThreadName = ({ children }) => (
  <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
    {children}
  </Text>
);

export const Timestamp = ({ children }) => (
  <Text style={{ fontSize: 12, color: "gray" }}>{children}</Text>
);

export const GeneralText = ({ children }) => (
  <Text style={{ fontSize: 14, color: "white" }}>{children}</Text>
);

export const PostContent = ({ children }) => (
  <Text style={{ fontSize: 16, color: "white", marginVertical: 8 }}>
    {children}
  </Text>
);

export const Author = ({ children }) => (
  <Text style={{ fontSize: 14, color: "white" }}>Author: {children}</Text>
);

export const Button = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ padding: 10, backgroundColor: "blue", borderRadius: 5 }}
  >
    <Text style={{ color: "white", fontWeight: "bold" }}>{title}</Text>
  </TouchableOpacity>
);

export const CommentInput = ({ onChangeText, value, placeholder }) => (
  <TextInput
    onChangeText={onChangeText}
    value={value}
    placeholder={placeholder}
    style={{
      backgroundColor: "white",
      padding: 10,
      borderRadius: 5,
      marginVertical: 8,
    }}
  />
);
