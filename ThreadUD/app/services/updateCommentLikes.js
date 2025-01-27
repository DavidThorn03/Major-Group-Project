import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const CommentLikes = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const response = await axios.put(`${API_URL}/comment/likes`, filters);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
