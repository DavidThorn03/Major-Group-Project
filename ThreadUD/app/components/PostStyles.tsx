import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome } from "@expo/vector-icons";

interface ContainerProps {
  children: ReactNode;
}

interface HeaderProps {
  children: ReactNode;
}

interface HeaderTextProps {
  children: ReactNode;
}

interface PostCardProps {
  children: ReactNode;
}

interface ThreadNameProps {
  children: ReactNode;
}

interface TimestampProps {
  children: ReactNode;
}

interface PostContentProps {
  children: ReactNode;
}

interface ButtonProps {
  onPress: () => void;
  title: string;
}

interface AuthorProps {
  children: ReactNode;
}

interface AuthorWithIconProps {
  children: ReactNode;
}

interface CommentCardProps {
  children: ReactNode;
}

interface CommentInputProps {
  onChangeText: (text: string) => void,
  value: string,
  placeholder: string,
  autoFocus: boolean,
}

export const Container = ({ children }: ContainerProps) => (
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

export const PostCard = ({ children }: PostCardProps) => (
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

export const CommentCard = ({ children }: CommentCardProps) => (
  <View
    style={{
      backgroundColor: "#1B1711",
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }}
  >
    {children}
  </View>
);

export const ThreadName = ({ children }: ThreadNameProps) => (
  <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
    {children}
  </Text>
);

export const Timestamp = ({ children }: TimestampProps) => (
  <Text style={{ fontSize: 12, color: "gray", marginBottom: 8 }}>
    {children}
  </Text>
);

export const GeneralText = ({ children }) => (
  <Text style={{ fontSize: 14, color: "white", marginVertical: 2 }}>
    {children}
  </Text>
);

export const PostContent = ({ children }: PostContentProps) => (
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

export const Author = ({ children }: AuthorProps) => (
  <Text style={{ fontSize: 13, color: "grey", opacity: 0.8, marginBottom: 3 }}>
    {children}
  </Text>
);

export const AuthorWithIcon = ({ children }: AuthorWithIconProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 3,
    }}
  >
    <FontAwesome
      name="user-circle-o"
      size={18}
      color="grey"
      style={{ marginRight: 5, opacity: 0.9 }}
    />
    <Author>{children}</Author>
  </View>
);

export const Button = ({ onPress, title }: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingTop: 5,
    }}
  >
    <Text style={{ color: "white", fontSize: 13 }}>{title}</Text>
    <Icon name="down" color="white" style={{ marginBottom: -6 }} />
  </TouchableOpacity>
);

export const Button2 = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingTop: 5,
    }}
  >
    <Text style={{ color: "white", fontSize: 13 }}>{title}</Text>
    <Icon name="up" color="white" style={{ marginBottom: -6 }} />
  </TouchableOpacity>
);

export const CommentInputContainer = ({ children, style }) => (
  <View
    style={{
      backgroundColor: "#0D0B08",
      borderTopWidth: 1,
      borderTopColor: "#444",
      padding: 10,
      flexDirection: "column",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 10,
      ...style,
    }}
  >
    {children}
  </View>
);

export const CommentInputWrapper = ({ children }) => (
  <View
    style={{
      flexDirection: "row",
    }}
  >
    <View
    style={{
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#1a2b61",
      borderRadius: 8,
      padding: 8,
      marginTop: 8,
    }}
  >
    <Icon2
      name="comment-text-outline"
      size={24}
      color="white"
      style={{ marginRight: 8 }}
    />

    {children}
    </View>
  </View>
);

export const CommentInput = ({
  onChangeText,
  value,
  placeholder,
  autoFocus,
}: CommentInputProps) => (
    <TextInput
      style={{
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        flex: 1,
        marginRight: 8,
      }}
      placeholderTextColor="#a0a0a0"
      value={value}
      onChangeText={onChangeText}
      placeholder = {placeholder}
      autoFocus={autoFocus}
    />

);

export const ReplyInput = ({ onChangeText, value, placeholder, autoFocus }) => (
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
    style={{ backgroundColor: "#0d0430", marginTop: 6, marginBottom: 8 }}
  >
    <Icon2
      name="tilde"
      size={16}
      color="red"
      style={{ marginBottom: -6, marginRight: 3 }}
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
    <Icon2
      name="tilde"
      size={16}
      color="red"
      style={{ marginBottom: -6, marginLeft: 3 }}
    />
  </View>
);

export const DeleteButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Icon name="delete" size={25} color="red" style={{ marginLeft: 9 }} />
  </TouchableOpacity>
);

export const ReplyDeleteButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Icon name="delete" size={25} color="red" style={{ marginLeft: 2 }} />
  </TouchableOpacity>
);

export const ReplyInputContainer = ({ children, style }) => (
  <View
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      backgroundColor: "#0D0B08",
      borderTopWidth: 1,
      borderTopColor: "#444",
      padding: 10,
      flexDirection: "column",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 10,
      ...style,
    }}
  >
    {children}
  </View>
);

export const ReplyInputHeader = ({ children }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
    }}
  >
    {children}
  </View>
);

export const ReplyingToText = ({ children }) => (
  <Text
    style={{
      color: "white",
      fontSize: 12,
    }}
  >
    {children}
  </Text>
);

export const ReplyInputWrapper = ({ children }) => (
  <View
    style={{
      flexDirection: "row",
    }}
  >
    {children}
  </View>
);

export const ReplySubmitButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      paddingHorizontal: 10,
      paddingVertical: 6,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#102157",
      borderRadius: 8,
      marginLeft: 4,
      marginTop: 7,
    }}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

export const BottomNavContainer = ({ children }) => (
  <View
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 5,
      backgroundColor: "#132236",
    }}
  >
    {children}
  </View>
);

export const ListFooterSpace = () => <View style={{ height: 63 }} />;
