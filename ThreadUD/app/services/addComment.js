import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const AddComment = async (commentFilter = {}, postFilter = {}) => {
  console.log("Comment", commentFilter);
  console.log("Post", postFilter);
  try {
    const response = await axios.post(`${API_URL}/comment/add`, commentFilter);
    /*if (!response.data) {
      return null;
    }
    else {
        postFilter.comments = [...postFilter.comments, response.data._id];
        const postresponse = await axios.put(`${API_URL}/post/addComment`, postFilter);
    }*/
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
