import React, { useState, useEffect, ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as AsyncStorage from "../../util/AsyncStorage.js";

interface ContainerProps {
  children: ReactNode;
}

interface HeaderProps {
  children: ReactNode;
}

interface HeaderTextProps {
  children: ReactNode;
}

interface InputProps {
  [key: string]: any;
}

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
}

interface UserInfoProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface UserInfoItemProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

interface TwoFactorAuthProps {
  auth: boolean;
  setAuth: (value: boolean) => void;
}

interface AuthSetupProps {
  children: ReactNode;
}

interface SubtitleTextProps {
  children: ReactNode;
}

export const Container = ({ children }: ContainerProps) => (
  <View
    style={{
      flex: 1,
      padding: 10,
      backgroundColor: "#3a4b5c",
    }}
  >
    {children}
  </View>
);

export const Header = ({ children }: HeaderProps) => {
  const navigation = useNavigation<any>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    const unsubscribe = navigation.addListener("focus", checkLoginStatus);
    return unsubscribe;
  }, [navigation]);

  const handleAuthAction = async () => {
    if (isLoggedIn) {
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
      style={{
        backgroundColor: "#1a2b61",
        marginBottom: 14,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, alignItems: "center" }}>{children}</View>
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
  <View style={{ alignItems: "flex-start" }}>
    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
      {children}
    </Text>
  </View>
);

export const UserInfo = ({ children, style }: UserInfoProps) => (
  <View
    style={{
      backgroundColor: "#0d0430",
      borderRadius: 8,
      padding: 16,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      ...style,
    }}
  >
    {children}
  </View>
);

export const UserInfoItem = ({
  label,
  value,
  onChangeText,
  editable = false,
}: UserInfoItemProps) => (
  <View style={{ flexDirection: "row", marginBottom: 16, marginTop: 4 }}>
    <Text
      style={{ color: "#a0a0a0", fontWeight: "bold", width: 75, fontSize: 16 }}
    >
      {label}:
    </Text>
    {editable ? (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{
          color: "white",
          flex: 1,
          fontSize: 17,
          fontWeight: "bold",
          borderBottomWidth: 1,
          borderBottomColor: "#444",
          paddingVertical: 4,
        }}
      />
    ) : (
      <Text
        style={{ color: "white", flex: 1, fontSize: 17, fontWeight: "bold" }}
      >
        {value}
      </Text>
    )}
  </View>
);

export const Button = ({ onPress, title, style }: ButtonProps) => (
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

export const TwoFactorAuthContainer = ({
  auth,
  setAuth,
}: TwoFactorAuthProps) => (
  <View style={styles.twoFactorContainer}>
    <Text style={styles.twoFactorLabel}>2FA:</Text>
    <Switch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={auth ? "#f5dd4b" : "#f4f3f4"}
      onValueChange={() => setAuth(!auth)}
      value={auth}
    />
  </View>
);

export const AuthSetupContainer = ({ children }: AuthSetupProps) => (
  <UserInfo style={styles.authSetupContainer}>{children}</UserInfo>
);

export const AuthText = ({ children }: { children: ReactNode }) => (
  <Text style={styles.authText}>{children}</Text>
);

export const AuthQRImage = () => (
  <Image
    source={require("../../assets/images/AuthQR.png")}
    style={styles.authQRImage}
  />
);

export const AuthCodeText = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: TextStyle;
}) => <Text style={[styles.authCodeText, style]}>{children}</Text>;

export const SubtitleText = ({ children }: SubtitleTextProps) => (
  <View
    style={{
      backgroundColor: "#0d0430",
      borderRadius: 8,
      padding: 16,
      marginBottom: 13,
      alignItems: "center",
    }}
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

export const ButtonGroupContainer = ({ children }: { children: ReactNode }) => (
  <View style={styles.buttonGroupContainer}>{children}</View>
);

export const ButtonRow = ({ children }: { children: ReactNode }) => (
  <View style={styles.buttonRow}>{children}</View>
);

export const ChangePasswordContainer = ({
  children,
}: {
  children: ReactNode;
}) => <View style={styles.changePasswordContainer}>{children}</View>;

const styles = {
  twoFactorContainer: {
    flexDirection: "row" as const,
    marginTop: 20,
    alignItems: "center" as const,
  },
  twoFactorLabel: {
    color: "#a0a0a0",
    fontWeight: "bold" as const,
    width: 75,
    fontSize: 16,
  },
  authSetupContainer: {
    marginTop: 16,
  },
  authText: {
    color: "white",
    marginBottom: 8,
  },
  authQRImage: {
    width: 200,
    height: 200,
    alignSelf: "center" as const,
  },
  authCodeText: {
    color: "white",
    marginBottom: 4,
  },
  buttonGroupContainer: {
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
  },
  changePasswordContainer: {
    paddingHorizontal: 20,
    marginBottom: 70, // This accounts for the BottomNavBar height (64px) plus some padding
  },
} as const;
