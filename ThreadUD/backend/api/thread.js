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
router.post("/:threadID/posts", async (req, res) => {
  const { postTitle, content, author } = req.body;
  const { threadID } = req.params;

  try {
    const post = new Post({
      threadID: mongoose.Types.ObjectId(threadID), // Save threadID as ObjectId
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

  console.log("Fetching posts for threadID:", threadID); // Debug log

  if (!threadID) {
    return res.status(400).json({ message: "threadID is required" });
  }

  try {
    const posts = await Post.find({
      threadID: mongoose.Types.ObjectId(threadID),
    }); // Ensure threadID matches in the DB
    console.log("Posts fetched:", posts); // Debug log
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

module.exports = router;
