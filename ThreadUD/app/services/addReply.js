import axios from "axios";
import IP from "../../config/IPAddress";

export const AddReply = async (filter = {}) => {//works
  console.log("Comment", filter);

  try {
    const response = await axios.post(`${IP}/comment/add`, filter);

    filter.reply_id = response.data;

    const postresponse = await axios.put(`${API_URL}/comment/reply`, filter);
    console.log("postresponse", postresponse.data);
    return postresponse.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
