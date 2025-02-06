import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const getUser = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/user?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
