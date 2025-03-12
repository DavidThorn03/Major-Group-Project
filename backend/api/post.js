import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import Thread from "../models/Thread.js";

const router = express.Router();

// Function to fetch posts with thread details (only non-flagged posts)
const getPostsWithThreadDetails = async () => {
  return await Post.find({ flagged: false }).exec();
};

// Get all posts (non-flagged posts)
router.get("/", async (req, res) => {
  console.log("Fetching posts...");
  try {
    const posts = await getPostsWithThreadDetails();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Update likes on a post
router.put("/likes", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const post = req.body.post;
  const like = req.body.like;
  const action = req.body.action;

  try {
    let updatedQuery = {};

    if (action == -1) {
      updatedQuery = { $pull: { likes: like } };
    } else {
      updatedQuery = { $push: { likes: like } };
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: post },
      updatedQuery,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Updated Post:", updatedPost);
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post likes:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/byThread", async (req, res) => {
  var ids = req.query.ids;
  if (typeof ids === "string" && ids.includes(",")) {
    ids = ids.split(","); 
  } else if (!Array.isArray(ids)) {
    ids = [ids]; 
  }

  if (ids.length === 0) {
    res.status(400).json({ message: "No valid IDs provided" });
  }
  console.log("ids", ids);

  try {
    const posts = await Post.find({ threadID: { $in: ids }, flagged: false }).exec();
    console.log("posts", posts);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "An error occurred while fetching the posts." });
  }

});

router.get("/byYear", async (req, res) => {
  const year = req.query.year;

  try {
    const threadIDs = await Thread.distinct("_id", { year });
    const posts = await Post.find({ threadID: { $in: threadIDs }, flagged: false }).exec();
    console.log("posts", posts);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "An error occurred while fetching the posts." });
  }

});

// Update comments on a post
router.put("/comments", async (req, res) => {
  // THIS WORKS FINE, OTHERS ARE PROBLEM
  console.log("Query Parameters:", req.body);

  const post = req.body.post;
  const comment = req.body.comment;
  const action = req.body.action;

  try {
    let updatedQuery = {};

    if (action == -1) {
      updatedQuery = { $pull: { comments: comment } };
    } else {
      updatedQuery = { $push: { comments: comment } };
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: post },
      updatedQuery,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Updated Post:", updatedPost);
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post comments:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all flagged posts
router.get("/flagged", async (req, res) => {
  console.log("Fetching flagged posts...");
  try {
    const flaggedPosts = await Post.find({ flagged: true }).exec();
    res.json(flaggedPosts);
  } catch (error) {
    console.error("Error fetching flagged posts:", error);
    res.status(500).json({ message: "Error fetching flagged posts", error });
  }
});

// Approve (unflag) a post
router.put("/:id/unflag", async (req, res) => {
  console.log("Unflagging post with id:", req.params.id);
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { flagged: false },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log("Post unflagged:", updatedPost);
    res.json(updatedPost);
  } catch (error) {
    console.error("Error unflagging post:", error);
    res.status(500).json({ message: "Error unflagging post", error });
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  console.log("Deleting post with id:", req.params.id);
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log("Post deleted:", deletedPost);
    res.json({ message: "Post deleted", id: req.params.id });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error });
  }
});

export default router;
