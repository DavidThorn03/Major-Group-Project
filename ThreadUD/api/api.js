import axios from "axios";

const API_URL = "http://192.168.0.11:5000/api";

// Get all items
export const User = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};
