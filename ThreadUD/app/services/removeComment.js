import axios from "axios";
import IP from "../../config/IPAddress.js";

export const RemoveComment = async (filter = {}) => {
  console.log("Comment", filter);
  console.log("Comment", filter.comment);

  try {
    comment = filter.comment;
    replies = filter.replies;
    console.log("Comment", filter.comment);
    const response = await axios.delete(`${IP}/comment/remove`, {
      data: { comment: comment, replies: replies },
    });

    const postresponse = await axios.put(`${IP}/post/comments`, filter);// this works

    return postresponse.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
