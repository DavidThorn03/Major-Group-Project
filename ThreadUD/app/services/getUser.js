import axios from "axios";
import IP from "../../config/IPAddress";

export const getUser = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${IP}/user?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
