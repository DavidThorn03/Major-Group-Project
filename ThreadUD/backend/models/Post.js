import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    threadID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    threadName: { type: String, required: true },
    postTitle: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema, "Post");

export default Post;
