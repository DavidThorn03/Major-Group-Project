import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const forgotPassword = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    console.log("Query Parameters:", queryParams);
    const response = await axios.get(`${API_URL}/user/forgotPassword?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return null;
  }
};
