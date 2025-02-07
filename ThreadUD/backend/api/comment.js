import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
    replyid: { type: Array, required: true },
    likes: { type: Array, required: true },
  },
  { versionKey: false }
);

const Comment = mongoose.model("Comment", commentSchema, "Comment");

router.post("/add", async (req, res) => {
  let author = req.body.comment.author;
  let content = req.body.comment.content;

  console.log("author", author);
  console.log("content", content);

  try {
    const comment = await Comment.create({
      author: author,
      content: content,
      replies: [],
      likes: [],
    });
    return res.json(comment._id);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the comments." });
  }
});

router.get("/comments", async (req, res) => {
  let ids = req.query.id;

  if (typeof ids === "string" && ids.includes(",")) {
    ids = ids.split(",");
  } else if (!Array.isArray(ids)) {
    ids = [ids];
  }

  if (ids.length === 0) {
    return res.status(400).json({ message: "No valid IDs provided" });
  }
  console.log("ids", ids);

  try {
    const comments = await Comment.find({ _id: { $in: ids } }).exec();
    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for the provided IDs" });
    }
    console.log("comments", comments);
    return res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the comments." });
  }
});

router.put("/likes", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const comment = req.body.comment;
  const likes = req.body.likes;
  let _id = new mongoose.Types.ObjectId(comment);

  console.log("comment", comment);
  console.log("likes", likes);

  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: _id },
      { likes: likes },
      { new: true }
    );
    console.log("updatedComment", updatedComment);
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    console.log("Updated comment:", updatedComment);
    res.json(updatedComment);
    return updatedComment;
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/comment/reply", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const comment = req.body.post;
  const replies = req.body.replies;

  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: comment },
      { replies: replies },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    console.log("Updated comment:", updatedComment);
    res.json(updatedComment);
    return updatedComment;
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
