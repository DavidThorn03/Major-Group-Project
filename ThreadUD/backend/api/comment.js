import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const mongoose = require("mongoose");
const { Post, getSinglePost } = require("./post");

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

router.post("/add", async (req, res) => { // THIS WORKS
    let author = req.body.comment.author;
    let content = req.body.comment.content;
  
    console.log("author", author);
    console.log("content", content);

    try {
      const comment = await Comment.create({author: author, content: content, replies: [], likes: []});
      return res.json(comment._id);
    }
    catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "An error occurred while fetching the comments." });
    }
  });

  const getComments = async ( ids ) => {
    if (typeof ids === "string" && ids.includes(",")) {
      ids = ids.split(","); 
    } else if (!Array.isArray(ids)) {
      ids = [ids]; 
    }
  
    if (ids.length === 0) {
      return status(400).json({ message: "No valid IDs provided" });
    }
    console.log("ids", ids);
  
    try {
      const comments = await Comment.find({ _id: { $in: ids } }).exec();
      if (!comments || comments.length === 0) {
        return status(404).json({ message: "No comments found for the provided IDs" });
      }
      console.log("comments", comments);
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      status(500).json({ message: "An error occurred while fetching the comments." });
    }
  }

  router.get("/comments", async (req, res) => {
    let ids = req.query.id;
    
    try {
      const comments = await getComments(ids);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts", error });
    }
  });
  
  router.delete("/remove", async (req, res) => {
    console.log("Query:", req.body);
    
    const comment = req.body.comment;
  
    try {
      const deletedComment = await Comment.findOneAndDelete({ _id: comment });
  
      if (!deletedComment) {
        return res.status(404).json({ message: "No comment found for the provided ID" });
      }
  
      return res.json({ deletedId: deletedComment._id });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "An error occurred while deleting the comment." });
    }
  });
  
  

router.put("/likes", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const comment = req.body.comment;
  const like = req.body.like;
  const action = req.body.action;

  console.log("comment", comment);

  try {
    
    let updatedQuery = {};

    if (action == -1) {
      updatedQuery = { $pull: { likes: like } };
    }
    else {
      updatedQuery = { $push: { likes: like } };
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: comment }, 
      updatedQuery, 
      { new: true }  
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    console.log("Updated Comment:", updatedComment);
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating Comment:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/reply", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const reply_id = req.body.reply_id;
  const _id = req.body._id;
  const action = req.body.action; 

  try {

    let updatedQuery = {};

    if (action == -1) {
      updatedQuery = { $pull: { replyid: reply_id } };
    }
    else {
      updatedQuery = { $push: { replyid: reply_id } };
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: _id }, 
      updatedQuery, 
      { new: true }  
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Updated Comment:", updatedComment);
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating Comment:", error);
    res.status(500).json({ message: error.message });
  }
});

  const handleCommentChangeStream = (io) => {
    const changeCommentStream = Comment.watch();
    const changePostStream = Post.watch();
    
    io.on("connection", (socket) => {
      const id = socket.handshake.query.post;
      console.log(`New client connected for post ${id}`);
    
      const handleCommentChange = async (next) => {
        try {
          if (next.operationType === "update") {
            const post = await getSinglePost(id);
            if (!post) return;
    
            const ids = post.comments || [];
            const updatedComments = await getComments(ids);
            socket.emit("update comments", updatedComments);
          }
        } catch (error) {
          console.error("Error processing comment change stream:", error);
        }
      };
    
      const handlePostChange = async (next) => {
        try {
          if (next.operationType === "update") {
            const post = await getSinglePost(id);
            if (!post) return;
    
            const ids = post.comments || [];
            const updatedComments = await getComments(ids);
            socket.emit("update comments", updatedComments);
          }
        } catch (error) {
          console.error("Error processing post change stream:", error);
        }
      };
    
      changeCommentStream.on("change", handleCommentChange);
      changePostStream.on("change", handlePostChange);
    
      socket.on("disconnect", () => {
        console.log(`Client disconnected from post ${id}`);
        changeCommentStream.removeListener("change", handleCommentChange);
        changePostStream.removeListener("change", handlePostChange);
      });
    });
    
  };
  

  module.exports = { Comment, handleCommentChangeStream, router };