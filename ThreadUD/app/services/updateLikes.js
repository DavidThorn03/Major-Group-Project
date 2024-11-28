import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const Likes = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.put(`${API_URL}/post/likes`, filters);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
