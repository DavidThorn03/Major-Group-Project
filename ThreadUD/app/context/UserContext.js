import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        if (userData) {
          console.log("Loaded user from storage:", userData);
          setUser(JSON.parse(userData));
        } else {
          console.log("No user found in storage.");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUser();
  }, []);

  const updateUser = async (newUser) => {
    setUser(newUser);
    try {
      await AsyncStorage.setItem("User", JSON.stringify(newUser));
      console.log("User updated in AsyncStorage:", newUser);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
