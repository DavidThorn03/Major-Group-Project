import express from "express";
import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import Post from "../models/Post.js";

const router = express.Router();

// Create a new thread
router.post("/", async (req, res) => {
  const { threadName, year, course } = req.body;

  try {
    const thread = new Thread({ threadName, year, course });
    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ message: "Error creating thread", error });
  }
});

// Get all threads
router.get("/", async (req, res) => {
  try {
    const threads = await Thread.find();
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Error fetching threads", error });
  }
});

// Create a new post in a thread
router.post("/:threadID/posts", async (req, res) => {
  const { postTitle, content, author } = req.body;
  const { threadID } = req.params;

  try {
    const thread = await Thread.findById(threadID);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const post = new Post({
      threadID: new mongoose.Types.ObjectId(threadID),
      threadName: thread.threadName,
      postTitle,
      content,
      author,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
});

// Get posts for a specific thread
router.get("/:threadID/posts", async (req, res) => {
  const { threadID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(threadID)) {
    return res.status(400).json({ message: "Invalid threadID format" });
  }

  try {
    const posts = await Post.find({
      threadID: new mongoose.Types.ObjectId(threadID),
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Update likes for a post
router.put("/likes", async (req, res) => {
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

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update comments for a post
router.put("/comments", async (req, res) => {
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

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating comments:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", async (req, res) => {
  console.log("Query Parameters:", req.query);

  const name = req.query.name;

  try {
    const threads = await Thread.find({
      threadName: { $regex: name, $options: "i" } 
    });
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Error fetching threads", error });
  }
});

router.get("/get", async (req, res) => {
  console.log("Query Parameters:", req.query);

  const { ids } = req.query;

  try {
    const threads = await Thread.find({ _id: { $in: ids } }).exec();
    if (!threads || threads.length === 0) {
      return status(404).json({ message: "No threads found for the provided IDs" });
    }
    console.log("threads", threads);
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "An error occurred while fetching the threads." });
  }
});

export default router;
