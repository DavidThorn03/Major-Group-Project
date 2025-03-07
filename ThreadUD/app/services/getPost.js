import axios from "axios";
import IP from "../../config/IPAddress.js";

export const getPosts = async () => {
  console.log("Fetching posts...");
  try {
    const response = await axios.get(`${IP}/post`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
