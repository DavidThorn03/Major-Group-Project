import axios from "axios";

const API_URL = "http://192.168.251.80:5000/api";

export const User = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/users?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};
