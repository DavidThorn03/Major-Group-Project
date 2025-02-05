import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const getPostsByThread = async (threadID) => {
  if (!threadID) {
    console.error("Error: threadId is required to fetch posts.");
    return [];
  }

  try {
    const response = await axios.get(`${API_URL}/thread/${threadID}/posts`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for thread ${threadID}:`, error);
    return [];
  }
};
