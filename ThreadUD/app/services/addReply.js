import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const AddReply = async (filter = {}) => {//works
  console.log("Comment", filter);

  try {
    const response = await axios.post(`${API_URL}/comment/add`, filter);

    filter.reply_id = response.data;

    const postresponse = await axios.put(`${API_URL}/comment/reply`, filter);
    console.log("postresponse", postresponse.data);
    return postresponse.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
