const express = require("express");
const router = express.Router();
const Thread = require("../models/Thread");
const Post = require("../models/Post");

// Create a new thread
router.post("/threads", async (req, res) => {
  const { name, description, createdBy } = req.body;

  try {
    const thread = new Thread({ name, description, createdBy });
    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: "Error creating thread", error });
  }
});

// Get all threads
router.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find().populate("posts");
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching threads", error });
  }
});

// Create a new post in a thread
router.post("/threads/:threadId/posts", async (req, res) => {
  const { content, createdBy } = req.body;
  const { threadId } = req.params;

  try {
    const post = new Post({ content, createdBy, threadId });
    await post.save();

    const thread = await Thread.findById(threadId);
    thread.posts.push(post._id);
    await thread.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});

// Get posts for a specific thread
router.get("/threads/:threadId/posts", async (req, res) => {
  const { threadId } = req.params;

  try {
    const posts = await Post.find({ threadId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

module.exports = router;
