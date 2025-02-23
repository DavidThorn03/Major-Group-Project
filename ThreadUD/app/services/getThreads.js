import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const getThreads = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    console.log("Query Parameters:", queryParams);
    const response = await axios.get(`${API_URL}/user/threads?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching threads:", error);
    return null;
  }
};
