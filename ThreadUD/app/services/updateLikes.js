import axios from "axios";
import IP from "../../config/IPAddress";

export const Likes = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const response = await axios.put(`${IP}/post/likes`, filters);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
