import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js"; // Ensure proper model import

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// Function to fetch posts with thread details
const getPostsWithThreadDetails = async () => {
  return await Post.aggregate([
    {
      $lookup: {
        from: "Thread", // Ensure this matches your MongoDB collection name
        localField: "threadID",
        foreignField: "_id",
        as: "threadData",
      },
    },
    {
      $project: {
        threadID: 1,
        threadName: { $arrayElemAt: ["$threadData.threadName", 0] },
        postTitle: 1,
        content: 1,
        author: 1,
        likes: 1,
        comments: 1,
      },
    },
  ]);
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
  console.log("Updating likes:", req.body);
  const { post, likes } = req.body;

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { postTitle: post },
      { likes },
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

// Update comments on a post
router.put("/comments", async (req, res) => {
  console.log("Updating comments:", req.body);
  const { post, comments } = req.body;

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { postTitle: post },
      { comments },
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

// Handle real-time post updates via change stream
const handlePostChangeStream = (io) => {
  const changeStream = Post.watch();

  changeStream.on("change", async (next) => {
    try {
      console.log("Change detected in Post collection:", next);

      if (
        next.operationType === "insert" ||
        next.operationType === "update" ||
        next.operationType === "delete"
      ) {
        const updatedPosts = await getPostsWithThreadDetails();
        io.emit("update posts", updatedPosts);
        console.log("Emitted updated posts");
      }
    } catch (error) {
      console.error("Error processing Post change stream:", error);
    }
  });
};

export { Post, handlePostChangeStream, router };
