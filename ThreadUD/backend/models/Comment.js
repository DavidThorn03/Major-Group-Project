import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
    replyid: { type: Array, required: true },
    likes: { type: Array, required: true },
    flagged: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const Comment = mongoose.model("Comment", commentSchema, "Comment");

export default Comment;