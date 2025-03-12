import axios from "axios";
import IP from "../../config/IPAddress.js";

export const getPostsByYear = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const queryParams = new URLSearchParams(filters).toString();
    console.log("Query Parameters:", queryParams);
    const response = await axios.get(`${IP}/post/byYear?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};
