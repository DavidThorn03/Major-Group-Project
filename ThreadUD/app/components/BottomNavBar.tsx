import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getIconStyle = (targetRoute) => ({
    width: 24,
    height: 24,
    tintColor: route.name === targetRoute ? "yellow" : "white",
  });

  const getButtonStyle = (targetRoute) => ({
    padding: 10,
    borderRadius: 10,
    backgroundColor: route.name === targetRoute ? "#3b5998" : "transparent",
  });

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: "#1a2b61",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <TouchableOpacity
        style={getButtonStyle("index")}
        onPress={() => navigation.navigate("index")}
      >
        <Image
          source={require("../../assets/icons/home.png")}
          style={getIconStyle("index")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getButtonStyle("search")}
        onPress={() => navigation.navigate("search")}
      >
        <Image
          source={require("../../assets/icons/search.png")}
          style={getIconStyle("search")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getButtonStyle("makePost")}
        onPress={() => navigation.navigate("makePost")}
      >
        <Image
          source={require("../../assets/icons/makePost.png")}
          style={getIconStyle("makePost")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getButtonStyle("thread")}
        onPress={() => navigation.navigate("thread")}
      >
        <Image
          source={require("../../assets/icons/makeThread.png")}
          style={getIconStyle("thread")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getButtonStyle("profile")}
        onPress={() => navigation.navigate("profile")}
      >
        <Image
          source={require("../../assets/icons/profile.png")}
          style={getIconStyle("profile")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavBar;
