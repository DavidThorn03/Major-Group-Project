import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const getPosts = async () => {
  console.log("Fetching posts...");
  try {
    const response = await axios.get(`${API_URL}/post`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
