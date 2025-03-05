import axios from "axios";
import IP from "../../config/IPAddress";

export const RemoveComment = async (filter = {}) => {
  console.log("Comment", filter);
  console.log("Comment", filter.comment);

  try {
    comment = {_id: filter.comment};
    console.log("Comment", filter.comment);
    const response = await axios.delete(`${IP}/comment/remove`, {
      data: { comment: comment },
    });

    const postresponse = await axios.put(`${IP}/post/comments`, filter);// this works

    return postresponse.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
