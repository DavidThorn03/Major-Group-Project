import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

// Define interface types for props
interface ChildrenProps {
  children: React.ReactNode;
}

interface StyleProps {
  style?: StyleProp<ViewStyle> | StyleProp<TextStyle> | string;
}

interface ButtonProps extends StyleProps {
  onPress: () => void;
  title: string;
}

interface TextWithStyleProps extends ChildrenProps, StyleProps {}

export const Container: React.FC<ChildrenProps> = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: "#3a4b5c" }}>
    <ScrollView
      contentContainerStyle={{ paddingTop: 80, paddingHorizontal: 8 }}
    >
      {children}
    </ScrollView>
  </View>
);

export const Header: React.FC<ChildrenProps> = ({ children }) => (
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

export const Input: React.FC<any> = (props) => (
  <TextInput
    {...props}
    className="border border-gray-300 rounded-lg p-2 mb-4 text-base bg-white"
  />
);

export const ButtonContainer: React.FC<ChildrenProps> = ({ children }) => (
  <View style={{ marginTop: 16, alignItems: "center" }}>{children}</View>
);

export const Button: React.FC<ButtonProps> = ({ onPress, title, style }) => (
  <TouchableOpacity
    className={`bg-blue-500 p-4 rounded-lg items-center my-2 mb-2 ${style}`}
    onPress={onPress}
  >
    <Text className="text-white font-bold">{title}</Text>
  </TouchableOpacity>
);

export const GeneralText: React.FC<TextWithStyleProps> = ({
  children,
  style,
}) => (
  <Text className={`text-base text-white text-center ${style}`}>
    {children}
  </Text>
);

export const ForgotPasswordButton: React.FC<
  TextWithStyleProps & { onPress: () => void }
> = ({ onPress, style, children }) => (
  <TouchableOpacity onPress={onPress} className={`mt-2 self-center ${style}`}>
    {children}
  </TouchableOpacity>
);
