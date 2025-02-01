const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Post, getSinglePost } = require("./post");

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
    replyid: { type: Array, required: true },
    likes: { type: Array, required: true }
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

router.post("/reply", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const content = req.body.content;
  const author = req.body.author;
  const _id = req.body._id;
  const action = req.body.action;

  try {
    const reply = await Comment.create({author: author, content: content, replyid: [], likes: []});
    const reply_id = reply._id;

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
      changeCommentStream.on("change", async (next) => {
        //console.log("Listening for changes to post with id:", id);

        try {
          //console.log("Change detected in Comment collection:", next);
  
          if (["insert", "update", "delete"].includes(next.operationType)) {
            const post = await getSinglePost(id);
            if (!post) {
              //console.log(`Post with id ${id} not found.`);
              return;
            }
  
            const ids = post.comments || [];
            const updatedComments = await getComments(ids);
            io.emit("update comments", updatedComments);
            //console.log("Emitted updated comments to clients in room:", id);
          }
        } catch (error) {
          //console.error("Error processing comment change stream:", error);
        }
      });

    changePostStream.on("change", async (next) => {
      //console.log("Listening for changes to post with id:", id);

      try {
        //console.log("Change detected in Comment collection:", next);

        if ("update".includes(next.operationType)) {
          const post = await getSinglePost(id);
          if (!post) {
            //console.log(`Post with id ${id} not found.`);
            return;
          }

          const ids = post.comments || [];
          const updatedComments = await getComments(ids);
          io.emit("update comments", updatedComments);
          //console.log("Emitted updated comments to clients in room:", id);
        }
      } catch (error) {
        //console.error("Error processing comment change stream:", error);
      }
    });

    socket.on("disconnect", () => {
      //console.log("Client disconnected");
    });
  });
  };
  

  module.exports = { Comment, handleCommentChangeStream, router };
