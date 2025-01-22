const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = require("../models/Post"); // Import Post model

// Function to validate ObjectId
function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Fetch all posts with thread details
router.get("/", async (req, res) => {
  console.log("Fetching posts...");
  try {
    const postsBeforeAggregation = await Post.find({});
    console.log("Posts before aggregation:", postsBeforeAggregation);

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "Thread", // Ensure collection name matches
          localField: "threadID",
          foreignField: "_id",
          as: "threadData",
        },
      },
      {
        $project: {
          threadName: { $arrayElemAt: ["$threadData.threadName", 0] },
          course: { $arrayElemAt: ["$threadData.course", 0] },
          year: { $arrayElemAt: ["$threadData.year", 0] },
          postTitle: 1,
          author: 1,
          content: 1,
          likes: 1,
          comments: 1,
        },
      },
    ]);
    console.log("Aggregation result:", JSON.stringify(posts, null, 2));

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Update likes for a post
router.put("/likes", async (req, res) => {
  const { postId, likes } = req.body; // Receive post ID and updated likes array

  // Validate postId
  if (!validateObjectId(postId)) {
    return res.status(400).json({ message: "Invalid postId" });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch a single post by ID (Optional - for testing)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post", error });
  }
});

module.exports = router;
