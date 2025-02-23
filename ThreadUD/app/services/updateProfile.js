import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const updateProfile = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const response = await axios.put(`${API_URL}/user/update`, filters);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
