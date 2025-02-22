import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const checkPassword = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/user/checkPassword?${queryParams}`);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return null;
  }
};
