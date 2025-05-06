import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as AsyncStorage from "../../util/AsyncStorage.js";

const BottomNavBar = () => {
  const route = useRoute();

  const router = useRouter();


  // Function to check if user is logged in before navigating
  const navigateWithAuthCheck = async (route) => {
    if (route === "makeThread" || route === "makePost") {
      try {
        const userData = await AsyncStorage.getItem("User");
        if (!userData) {
          console.log("User not logged in, redirecting to login page");
          router.replace("/login");
          return;
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.replace("/login");
        return;
      }
    }

    // If not a protected route or user is logged in, proceed with navigation
    router.push(route);
  };

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
        onPress={() => router.push("/")}
      >
        <Image
          source={require("../../assets/icons/home.png")}
          style={getIconStyle("index")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getButtonStyle("search")}
        onPress={() => router.push("/search")}
      >
        <Image
          source={require("../../assets/icons/search.png")}
          style={getIconStyle("search")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getButtonStyle("makePost")}
        onPress={() => navigateWithAuthCheck("makePost")}
      >
        <Image
          source={require("../../assets/icons/makePost.png")}
          style={getIconStyle("makePost")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getButtonStyle("makeThread")}
        onPress={() => navigateWithAuthCheck("makeThread")}
      >
        <Image
          source={require("../../assets/icons/makeThread.png")}
          style={getIconStyle("makeThread")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getButtonStyle("profile")}
        onPress={() => router.push("/profile")}
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
