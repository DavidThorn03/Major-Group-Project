import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";

export const Container = ({ children }) => (
  <View className="flex-1 p-4" style={{ backgroundColor: "#23364a" }}>
    {children}
  </View>
);

export const CloseButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} className="absolute top-5 left-5">
    <Icon name="close" size={24} color="white" />
  </TouchableOpacity>
);

export const StyledPicker = ({ selectedValue, onValueChange, children }) => (
  <View
    style={{
      backgroundColor: "white",
      marginVertical: 56,
      marginLeft: 10,
      width: "75%",
    }}
  >
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={{ color: "white" }}
    >
      {children}
    </Picker>
  </View>
);

export const StyledTextInput = ({ onChangeText, value }) => (
  <TextInput
    className="flex-1 text-white text-lg"
    placeholder="Write your post..."
    placeholderTextColor="#888"
    multiline
    autoFocus
    onChangeText={onChangeText}
    value={value}
  />
);

export const PostButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} className="absolute top-5 right-5">
    <Text className="text-white text-lg font-bold">Post</Text>
  </TouchableOpacity>
);
