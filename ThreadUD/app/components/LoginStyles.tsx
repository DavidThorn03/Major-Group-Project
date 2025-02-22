import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const Container = ({ children }) => (
  <View style={{ flex: 1, padding: 16, backgroundColor: "#f3f4f6" }}>
    {children}
  </View>
);

export const Header = ({ children }) => (
  <Text
    style={{
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
    }}
  >
    {children}
  </Text>
);

export const Input = (props) => (
  <TextInput
    {...props}
    style={{
      height: 40,
      borderWidth: 1,
      borderColor: "#d1d5db",
      marginBottom: 16,
      paddingHorizontal: 8,
      borderRadius: 4,
    }}
  />
);

export const ButtonContainer = ({ children }) => (
  <View style={{ marginTop: 16, alignItems: "center" }}>{children}</View>
);

export const Button = ({ onPress, title, style }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      {
        backgroundColor: "#3b82f6",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 8,
      },
      style,
    ]}
  >
    <Text style={{ color: "white", fontWeight: "bold" }}>{title}</Text>
  </TouchableOpacity>
);

export const GeneralText = ({ children, style }) => (
  <Text
    style={[{ fontSize: 16, color: "#374151", textAlign: "center" }, style]}
  >
    {children}
  </Text>
);

export const ForgotPasswordButton = ({ onPress, style, children }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[{ marginTop: 10, alignSelf: "center" }, style]}
  >
    {children}
  </TouchableOpacity>
);
