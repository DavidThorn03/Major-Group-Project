import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const Header = ({ children }) => (
  <View
    className="p-4 flex-row justify-center items-center"
    style={{ backgroundColor: "#1a2b61", marginBottom: 14 }}
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
    style={{ padding: 16, backgroundColor: "#3a4b5c" }}
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
    style={{ backgroundColor: "#0d0430", marginBottom: 24 }}
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
