import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const Header = ({ children }) => (
  <View
    className="flex-row justify-center items-center"
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
    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
      {children}
    </Text>
  </View>
);

export const Container = ({ children }) => (
  <View
    className="flex-1 p-2"
    style={{ backgroundColor: "#3a4b5c", paddingTop: 100 }}
  >
    {children}
  </View>
);

export const ThreadName = ({ children }) => (
  <Text
    style={{
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: "white",
    }}
  >
    {children}
  </Text>
);

export const GeneralText = ({ children }) => (
  <Text style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
    {children}
  </Text>
);

export const Input = (props) => (
  <TextInput
    style={{
      height: 40,
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      flex: 1,
      marginBottom: 16,
    }}
    {...props}
  />
);

export const PostCard = ({ children }) => (
  <View
    className="p-4 my-2 rounded-lg shadow-md"
    style={{ backgroundColor: "#0d0430" }}
  >
    {children}
  </View>
);

export const SubtitleText = ({ children }) => (
  <View
    className="p-4 rounded-lg flex-row justify-center items-center"
    style={{ backgroundColor: "#0d0430", marginBottom: 12 }}
  >
    <Text
      style={{
        textAlign: "center",
        color: "red",
        fontSize: 13,
        fontStyle: "italic",
        fontFamily: "Cochin",
        marginBottom: -10,
        marginTop: -10,
      }}
    >
      {children}
    </Text>
  </View>
);

export const ListFooterSpace = () => <View style={{ height: 63.5 }} />;
