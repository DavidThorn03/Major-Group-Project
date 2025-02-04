import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const getPostsByThread = async (threadId) => {
  if (!threadId) {
    console.error("Error: threadId is required to fetch posts.");
    return [];
  }

  try {
    const response = await axios.get(`${API_URL}/thread/${threadId}/posts`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for thread ${threadId}:`, error);
    return [];
  }
};
