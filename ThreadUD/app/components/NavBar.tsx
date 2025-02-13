import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NavBar: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: "#314275",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
      }}
    >
      <View
        style={{
          maxWidth: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Image
            source={require("../../assets/images/ThreadUD-logo.png")}
            style={{ height: 120, width: 240, marginLeft: -40, marginTop: -35 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 8 }}>
          <Image
            source={require("../../assets/icons/notification.png")}
            style={{
              width: 24,
              height: 24,
              marginTop: -37,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;
