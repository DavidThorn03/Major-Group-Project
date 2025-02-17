import axios from "axios";
import { API_URL } from "../constants/apiConfig";

export const RemoveComment = async (filter = {}) => {
  console.log("Comment", filter);
  console.log("Comment", filter.comment);

  try {
    comment = {_id: filter.comment};
    console.log("Comment", filter.comment);
    const response = await axios.delete(`${API_URL}/comment/remove`, {
      data: { comment: comment },
    });

    const postresponse = await axios.put(`${API_URL}/post/comments`, filter);// this works

    return postresponse.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
