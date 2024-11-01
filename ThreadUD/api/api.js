import axios from "axios";

const API_URL = "http://192.168.0.11:5000/api"; // Make sure to change the port if necessary

// Get all items
export const test = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};
