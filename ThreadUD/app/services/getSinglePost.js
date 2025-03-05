import axios from "axios";
import IP from "../../config/IPAddress";

export const getSinglePost = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${IP}/comment/single?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
