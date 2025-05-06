import React from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as AsyncStorage from "../../util/AsyncStorage.js";

interface AdminNavProps {
  currentScreen: "adminPosts" | "adminComments";
}

const AdminNav: React.FC<AdminNavProps> = ({ currentScreen }) => {
  const router = useRouter();

  // Handle logout button press
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("User");
      Alert.alert("Logged out", "You have been logged out.");
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Unable to log out.");
    }
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[
          styles.navItem,
          currentScreen === "adminPosts" && styles.activeNavItem,
        ]}
        onPress={() => router.replace("/adminPosts")}
      >
        <Text style={styles.navText}>Posts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navItem,
          currentScreen === "adminComments" && styles.activeNavItem,
        ]}
        onPress={() => router.replace("/adminComments")}
      >
        <Text style={styles.navText}>Comments</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={handleLogout}
      >
        <Image
          source={require("../../assets/icons/logout.png")}
          style={{ width: 24, height: 24, tintColor: "white" }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1a2b61",
    paddingVertical: 10,
  },
  navItem: {
    padding: 10,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  navText: {
    fontSize: 16,
    color: "#007bff",
  },
});

export default AdminNav;
