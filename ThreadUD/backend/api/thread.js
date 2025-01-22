const express = require("express");
const router = express.Router();
const Thread = require("../models/Thread"); // Import Thread model
const Post = require("../models/Post"); // Import Post model

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
    const threads = await Thread.find(); // No need to populate posts
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Error fetching threads", error });
  }
});

// Create a new post in a thread
router.post("/:threadId/posts", async (req, res) => {
  const { postTitle, content, author } = req.body;
  const { threadId } = req.params;

  try {
    const post = new Post({
      threadID: threadId, // Reference the threadID
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
router.get("/:threadId/posts", async (req, res) => {
  const { threadId } = req.params;

  try {
    const posts = await Post.find({ threadID: threadId }); // Fetch posts by threadID
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts for thread:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

module.exports = router;
