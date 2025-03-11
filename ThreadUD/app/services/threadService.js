import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createThread = async (
  IP: string,
  threadName: string,
  year: string,
  course: string
) => {
  try {
    const response = await axios.post(`${IP}/thread`, {
      threadName,
      year: parseInt(year, 10),
      course,
    });

    return response; // Return the response to handle it in the component
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};

export const updateThread = async (
  IP: string,
  userId: string,
  action: string,
  threadID: string,
  successMessage: string,
  joined: boolean,
  setUser: Function,
  setJoined: Function
) => {
  try {
    const response = await fetch(`${IP}/user/${userId}/${action}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ threadId: threadID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error ${successMessage} thread:`, errorData);
      return;
    }

    const updatedUserData = await response.json();
    setUser(updatedUserData.user);
    await AsyncStorage.setItem("User", updatedUserData.user);
    setJoined(!joined);
  } catch (error) {
    console.error(`Error making ${successMessage} thread request:`, error);
  }
};
