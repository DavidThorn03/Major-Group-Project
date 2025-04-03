import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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

interface ButtonContainerProps {
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

interface GeneralTextProps {
  children: ReactNode;
}

export const Container = ({ children }: ContainerProps) => (
  <View
    style={{ flex: 1, padding: 10, paddingTop: 64, backgroundColor: "#3a4b5c" }}
  >
    {children}
  </View>
);

export const Header = ({ children }: HeaderProps) => (
  <View
    style={{
      backgroundColor: "#1a2b61",
      marginBottom: 14,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      paddingHorizontal: 16,
    }}
  >
    {children}
  </View>
);

export const HeaderText = ({ children }: HeaderTextProps) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
      {children}
    </Text>
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

export const ThreadName = ({ children }: ThreadNameProps) => (
  <Text className="text-2xl font-bold text-white">{children}</Text>
);

export const Timestamp = ({ children }: TimestampProps) => (
  <Text className="text-gray-500 text-xs mb-2">{children}</Text>
);

export const PostContent = ({ children }: PostContentProps) => (
  <Text className="text-base text-white">{children}</Text>
);

export const ButtonContainer = ({ children }: ButtonContainerProps) => (
  <View className="mt-4 items-center">{children}</View>
);

export const Button = ({ onPress, title }: ButtonProps) => (
  <TouchableOpacity
    className="bg-blue-500 p-4 rounded-lg items-center my-2"
    onPress={onPress}
  >
    <Text className="text-white font-bold">{title}</Text>
  </TouchableOpacity>
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

export const GeneralText = ({ children }: GeneralTextProps) => (
  <Text className="text-base text-white">{children}</Text>
);

export const ListFooterSpace = () => <View style={{ height: 63 }} />;
