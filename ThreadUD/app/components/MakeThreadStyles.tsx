import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const Container = ({ children }) => (
  <View
    className="flex-1 p-2"
    style={{ backgroundColor: "#3a4b5c", paddingTop: 100 }}
  >
    {children}
  </View>
);

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

export const Input = (props) => (
  <TextInput
    {...props}
    style={{
      height: 48,
      borderWidth: 1,
      borderColor: "#d1d5db",
      marginBottom: 16,
      paddingHorizontal: 8,
      borderRadius: 4,
      backgroundColor: "white",
    }}
  />
);

export const Button = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: "#007bff",
      padding: 12,
      borderRadius: 4,
      alignItems: "center",
    }}
  >
    <Text style={{ color: "white", fontWeight: "bold" }}>{title}</Text>
  </TouchableOpacity>
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
