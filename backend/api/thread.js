import express from "express";
import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import Post from "../models/Post.js";
import perspectiveAPI from "./perspective.js";
import { Filter } from "bad-words";

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

// Get a specific thread by ID
router.get("/:threadID", async (req, res) => {
  const { threadID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(threadID)) {
    return res.status(400).json({ message: "Invalid threadID format" });
  }

  try {
    const thread = await Thread.findById(threadID);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.status(200).json(thread);
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "Error fetching thread", error });
  }
});

// Create a new post in a thread
router.post("/:threadID/posts", async (req, res) => {
  const { postTitle, content, author } = req.body;
  const { threadID } = req.params;
  
  const flagged = await perspectiveAPI(postTitle + content);

  const filter = new Filter();
  const filteredContent = filter.clean(content);

  try {
    const thread = await Thread.findById(threadID);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const post = new Post({
      threadID: new mongoose.Types.ObjectId(threadID),
      threadName: thread.threadName,
      postTitle,
      content: filteredContent,
      author,
      flagged,
    });
    await post.save();
    if (flagged) {
      return res.status(202).json(post);
    }
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
      flagged: false,
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


// Get multiple threads by IDs
router.post("/multiple", async (req, res) => {
  const { threadIDs } = req.body;

  if (
    !Array.isArray(threadIDs) ||
    threadIDs.some((id) => !mongoose.Types.ObjectId.isValid(id))
  ) {
    return res.status(400).json({ message: "Invalid threadIDs format" });
  }

  try {
    const threads = await Thread.find({
      _id: { $in: threadIDs },
    });
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Error fetching threads", error });
  }
});

export default router;
