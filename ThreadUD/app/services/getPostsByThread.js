import axios from "axios";
import IP from "../../config/IPAddress.js";

export const getPostsByThread = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    console.log("Query Parameters:", queryParams);
    const response = await axios.get(`${IP}/post/byThread?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};
