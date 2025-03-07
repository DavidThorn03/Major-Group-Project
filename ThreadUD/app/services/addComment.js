import axios from "axios";
import IP from "../../config/IPAddress.js";

export const AddComment = async (commentFilter = {}, postFilter = {}) => {// works
  console.log("Comment", commentFilter);

  try {
    const response = await axios.post(`${IP}/comment/add`, commentFilter);

    postFilter.comment = response.data;
    console.log("Post", postFilter);

    const postresponse = await axios.put(`${IP}/post/comments`, postFilter);

    return postresponse.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
