import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from "react-native";

export const Container = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: "#3a4b5c" }}>
    <ScrollView
      contentContainerStyle={{ paddingTop: 80, paddingHorizontal: 8 }}
    >
      {children}
    </ScrollView>
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
    <View style={{ alignItems: "center" }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        {children}
      </Text>
    </View>
  </View>
);

export const Input = (props) => (
  <TextInput
    {...props}
    className="border border-gray-300 rounded-lg p-2 mb-4 text-base bg-white"
  />
);

export const Button = ({ onPress, title, style }) => (
  <TouchableOpacity
    className={`bg-blue-500 p-4 rounded-lg items-center my-2 mb-2 ${style}`}
    onPress={onPress}
  >
    <Text className="text-white font-bold">{title}</Text>
  </TouchableOpacity>
);

export const AuthSwitchContainer = ({ children }) => (
  <View style={{ flexDirection: "row" }}>{children}</View>
);

export const AuthSwitch = ({ value, onValueChange }) => (
  <Switch
    trackColor={{ false: "#767577", true: "#81b0ff" }}
    thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
    onValueChange={onValueChange}
    value={value}
    style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.2 }] }}
  />
);

export const AuthInstructions = ({ children }) => (
  <View>
    <Text style={{ color: "white", marginTop: 10 }}>{children}</Text>
  </View>
);

export const AuthStep = ({ children }) => (
  <Text style={{ color: "white", marginTop: 5 }}>{children}</Text>
);

export const AuthDivider = () => (
  <Text
    style={{
      color: "white",
      marginTop: 5,
      textAlign: "center",
      fontWeight: "bold",
    }}
  >
    OR
  </Text>
);

export const AuthQRCode = () => (
  <Image source={require("../../assets/images/AuthQR.png")} />
);

export const AuthCode = ({ code }) => (
  <Text style={{ color: "white", marginTop: 5, marginBottom: 24 }}>{code}</Text>
);
