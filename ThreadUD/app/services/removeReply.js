import axios from "axios";
import IP from "../../config/IPAddress.js";

export const RemoveReply = async (filter) => {
  console.log("Comment", filter);
  console.log("Comment", filter.reply_id);

  try {
    comment = {_id: filter.reply_id};
    console.log("Comment", filter.comment);
    const response = await axios.delete(`${IP}/comment/remove`, {
      data: { comment: comment },
    });

    const postresponse = await axios.put(`${IP}/comment/reply`, filter);// this works

    return postresponse.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
