import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const getPostsByThread = async (threadId) => {
  console.log(`Fetching posts for thread: ${threadId}`);
  try {
    const response = await axios.get(`${API_URL}/thread/${threadId}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
