import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js"; // Ensure proper model import
import Thread from "../models/Thread.js"; // Ensure proper model import

const router = express.Router();

// Function to fetch posts with thread details
const getPostsWithThreadDetails = async () => {
  return await Post.find({flagged: false}).exec();
};

// Get all posts
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
    }
    else {
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


router.put("/comments", async (req, res) => {   
  console.log("Query Parameters:", req.body);

  const post = req.body.post;
  const comment = req.body.comment;
  const action = req.body.action;


  try {
    let updatedQuery = {};

    if (action == -1) {
      updatedQuery = { $pull: { comments: comment } };
    }
    else {
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

export default router;
