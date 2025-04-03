import React, { useState, useEffect, ReactNode } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as AsyncStorage from "../../util/AsyncStorage.js";
import { FontAwesome } from "@expo/vector-icons";

// Define navigation types
type RootStackParamList = {
  index: undefined;
  login: undefined;
  // Add other screens as needed
};

// Define component props types
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

interface ThreadCardProps {
  children: ReactNode;
}

interface ThreadNameProps {
  children: ReactNode;
}

interface TimestampProps {
  children: ReactNode;
}

interface AuthorProps {
  children: ReactNode;
}

interface AuthorWithIconProps {
  children: ReactNode;
}

interface PostContentProps {
  children: ReactNode;
}

interface ButtonContainerProps {
  children: ReactNode;
}

interface GeneralTextProps {
  children: ReactNode;
}

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: string;
  isActive?: boolean;
}

interface UserInfoProps {
  children: ReactNode;
}

interface UserInfoItemProps {
  label: string;
  value: string;
}

export const Container = ({ children }: ContainerProps) => (
  <View
    style={{
      flex: 1,
      padding: 10,
      paddingTop: 64,
      backgroundColor: "#3a4b5c",
    }}
  >
    {children}
  </View>
);

export const Header = ({ children }: HeaderProps) => {
  const navigation = useNavigation<any>(); // using any temporarily to fix the error
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        setIsLoggedIn(!!userData);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Set up listener for when the component is focused again
    const unsubscribe = navigation.addListener("focus", checkLoginStatus);
    return unsubscribe;
  }, [navigation]);

  // Handle login/logout button press
  const handleAuthAction = async () => {
    if (isLoggedIn) {
      // Logout user
      try {
        await AsyncStorage.removeItem("User");
        setIsLoggedIn(false);
        console.log("User logged out successfully");
        navigation.navigate("index");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    } else {
      navigation.navigate("login");
    }
  };

  return (
    <View
      className="flex-row justify-between items-center"
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
      <View className="flex-1 items-center">{children}</View>
      <TouchableOpacity onPress={handleAuthAction}>
        <Image
          source={
            isLoggedIn
              ? require("../../assets/icons/logout.png")
              : require("../../assets/icons/login.png")
          }
          style={{
            width: 24,
            height: 24,
            tintColor: "white",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

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

export const ThreadCard = ({ children }: ThreadCardProps) => (
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

export const ThreadInfo = ({ children }: GeneralTextProps) => (
  <Text className="text-base text-white mb-2">{children}</Text>
);

export const Timestamp = ({ children }: TimestampProps) => (
  <Text className="text-gray-500 text-xs mb-2">{children}</Text>
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

export const PostContent = ({ children }: PostContentProps) => (
  <Text className="text-base text-white">{children}</Text>
);

export const ButtonContainer = ({ children }: ButtonContainerProps) => (
  <View className="mt-4 items-center">{children}</View>
);

export const ButtonGroupContainer = ({ children }: ButtonContainerProps) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      gap: 10,
    }}
  >
    {children}
  </View>
);

export const Button = ({ onPress, title, style, isActive }: ButtonProps) => (
  <TouchableOpacity
    className={`p-4 rounded-lg items-center my-2 ${style} ${
      isActive ? "bg-blue-700 border-2 border-black" : "bg-blue-500"
    }`}
    onPress={onPress}
  >
    <Text className={`text-white font-bold ${isActive ? "text-lg" : ""}`}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const ListFooterSpace = () => <View style={{ height: 63 }} />;

export const UserInfo = ({ children }: UserInfoProps) => (
  <View
    style={{
      backgroundColor: "#1B1711",
      borderRadius: 8,
      padding: 16,
      marginTop: 12,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }}
  >
    {children}
  </View>
);

export const UserInfoItem = ({ label, value }: UserInfoItemProps) => (
  <View style={{ flexDirection: "row", marginBottom: 8 }}>
    <Text
      style={{ color: "#a0a0a0", fontWeight: "bold", width: 75, fontSize: 16 }}
    >
      {label}:
    </Text>
    <Text style={{ color: "white", flex: 1, fontSize: 17, fontWeight: "bold" }}>
      {value}
    </Text>
  </View>
);

export const GeneralText = ({ children }: GeneralTextProps) => (
  <Text className="text-base text-white">{children}</Text>
);

export const PostActionsContainer = ({ children }: ButtonContainerProps) => (
  <View style={{ flexDirection: "row" }}>{children}</View>
);

export const PostActionSpacer = () => <View style={{ paddingHorizontal: 5 }} />;
