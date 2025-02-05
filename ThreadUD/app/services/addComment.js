import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const AddComment = async (commentFilter = {}, postFilter = {}) => {// works
  console.log("Comment", commentFilter);

  try {
    const response = await axios.post(`${API_URL}/comment/add`, commentFilter);

    postFilter.comment = response.data;
    console.log("Post", postFilter);

    const postresponse = await axios.put(`${API_URL}/post/comments`, postFilter);

    return postresponse.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
