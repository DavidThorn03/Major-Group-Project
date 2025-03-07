import axios from "axios";
import IP from "../../config/IPAddress.js";

export const searchThreads = async (filters = {}) => {
  console.log("filters", filters);
  
  try {
    const queryParams = new URLSearchParams(filters).toString();
    console.log("Query Parameters:", queryParams);
    const response = await axios.get(`${IP}/user/search?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return null;
  }
};
