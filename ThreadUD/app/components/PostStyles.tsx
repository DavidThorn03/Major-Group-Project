import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

export const Container = ({ children }) => (
  <View
    style={{
      flex: 1,
      padding: 10,
      paddingTop: 70,
      backgroundColor: "#3a4b5c",
    }}
  >
    {children}
  </View>
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

export const CommentCard = ({ children }) => (
  <View
    style={{
      backgroundColor: "#1B1711",
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
  <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
    {children}
  </Text>
);

export const Timestamp = ({ children }) => (
  <Text style={{ fontSize: 12, color: "gray", marginBottom: 8 }}>
    {children}
  </Text>
);

export const GeneralText = ({ children }) => (
  <Text style={{ fontSize: 14, color: "white", marginVertical: 2 }}>
    {children}
  </Text>
);

export const PostContent = ({ children }) => (
  <Text
    style={{
      fontSize: 16,
      color: "white",
      marginVertical: 8,
      lineHeight: 20,
    }}
  >
    {children}
  </Text>
);

export const Author = ({ children }) => (
  <Text
    className="text-sm mb-3 mt-1"
    style={{ fontSize: 13, color: "green", opacity: 0.7 }}
  >
    {children}
  </Text>
);

export const Button = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: "#1a2b61",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 8,
    }}
  >
    <Text style={{ color: "white", fontWeight: "bold" }}>{title}</Text>
  </TouchableOpacity>
);

export const CommentInput = ({
  onChangeText,
  value,
  placeholder,
  autoFocus,
}) => (
  <TextInput
    onChangeText={onChangeText}
    value={value}
    placeholder={placeholder}
    autoFocus={autoFocus}
    style={{
      backgroundColor: "white",
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      flex: 1,
      marginRight: 8,
    }}
  />
);

export const CommentHeader = ({ children }) => (
  <View
    className="p-4 rounded-lg flex-row justify-center items-center"
    style={{ backgroundColor: "#0d0430", marginTop: 6 }}
  >
    <Icon
      name="down"
      size={15}
      color="red"
      style={{ marginBottom: -7, marginRight: 3 }}
    />
    <Text
      style={{
        textAlign: "center",
        color: "red",
        fontSize: 18,
        fontStyle: "italic",
        fontFamily: "Cochin",
        marginBottom: -20,
        marginTop: -20,
      }}
    >
      {children}
    </Text>
    <Icon
      name="down"
      size={15}
      color="red"
      style={{ marginBottom: -7, marginLeft: 3 }}
    />
  </View>
);

export const ListFooterSpace = () => <View style={{ height: 63.5 }} />;
