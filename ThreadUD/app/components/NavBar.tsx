import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as AsyncStorage from "../../util/AsyncStorage.js";

const NavBar: React.FC = () => {
  const navigation = useNavigation();
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
        // Optionally navigate to index or home page
        navigation.navigate("index");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    } else {
      // Navigate to login page
      navigation.navigate("login");
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#1a2b61",
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
              marginTop: -37,
              tintColor: "white",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;
