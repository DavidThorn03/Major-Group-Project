import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const AddReply = async (filter = {}) => {
  console.log("Filter", filter);

  try {
    const response = await axios.post(`${API_URL}/comment/reply`, filter);

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
