import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import perspectiveAPI from "./perspective.js";
import { Filter } from "bad-words";

const router = express.Router();

// Add a comment
router.post("/add", async (req, res) => {
  let author = req.body.comment.author;
  let content = req.body.comment.content;

  const flagged = await perspectiveAPI(content);

  const filter = new Filter();
  const filteredContent = filter.clean(content);

  console.log("author", author);
  console.log("content", content);

  try {
    const comment = await Comment.create({
      author: author,
      content: filteredContent,
      replies: [],
      likes: [],
      flagged: flagged,
    });
    return res.json(comment._id);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      message: "An error occurred while fetching the comments.",
    });
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
      const comments = await Comment.find({ _id: { $in: ids }, flagged: false }).exec();
      console.log("comments", comments);
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      status(500).json({ message: "An error occurred while fetching the comments." });
    }
  }

  if (ids.length === 0) {
    return res.status(400).json({ message: "No valid IDs provided" });
  }
  console.log("ids", ids);

  try {
    const comments = await Comment.find({
      _id: { $in: ids },
      flagged: false,
    }).exec();
    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for the provided IDs" });
    }
  });
  
  router.delete("/remove", async (req, res) => {
    console.log("Query:", req.body);
    
    const comment = req.body.comment;
    const replies = req.body.replies;
  
    try {
      const deletedComment = await Comment.findOneAndDelete({ _id: comment });
      const result = await Comment.deleteMany({ _id: { $in: replies } });
      console.log("result", result);

  
      if (!deletedComment) {
        return res.status(404).json({ message: "No comment found for the provided ID" });
      }
  
      return res.json({ deletedId: deletedComment._id });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "An error occurred while deleting the comment." });
    }

    return res.json({ deletedId: deletedComment._id });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      message: "An error occurred while deleting the comment.",
    });
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
    } else {
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

router.get("/single", async (req, res) => {
  console.log("in api");
  const id = req.query.id;
  try {
    const posts = await getSinglePost(id);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

const getSinglePost = async (id) => {
  console.log("Fetching post with id:", id);
  if (id == null) {
    return null;
  }

  try {
    const post = await Post.findOne({ _id: id }).exec();
    if (!post) {
      throw new Error("Post not found");
    }
    console.log("Fetched post:", post);
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

router.put("/reply", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const reply_id = req.body.reply_id;
  const _id = req.body._id;
  const action = req.body.action;

  try {
    let updatedQuery = {};

    if (action == -1) {
      updatedQuery = { $pull: { replyid: reply_id } };
    } else {
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

// Get all flagged comments
router.get("/flagged", async (req, res) => {
  console.log("Fetching flagged comments...");
  try {
    const flaggedComments = await Comment.find({ flagged: true }).exec();
    res.json(flaggedComments);
  } catch (error) {
    console.error("Error fetching flagged comments:", error);
    res.status(500).json({ message: "Error fetching flagged comments", error });
  }
});

// Approve (unflag) a comment
router.put("/:id/unflag", async (req, res) => {
  console.log("Unflagging comment with id:", req.params.id);
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { flagged: false },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    console.log("Comment unflagged:", updatedComment);
    res.json(updatedComment);
  } catch (error) {
    console.error("Error unflagging comment:", error);
    res.status(500).json({ message: "Error unflagging comment", error });
  }
});

// Delete a comment
router.delete("/:id", async (req, res) => {
  console.log("Deleting comment with id:", req.params.id);
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    console.log("Comment deleted:", deletedComment);
    res.json({ message: "Comment deleted", id: req.params.id });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error });
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

export { handleCommentChangeStream, router };
