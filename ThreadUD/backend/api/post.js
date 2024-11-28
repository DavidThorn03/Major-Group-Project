// post.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Post Schema
const postSchema = new mongoose.Schema({
  _id: String,
  threadID: String,
  threadName: String,
  postTitle: String,
  content: String,
  author: String,
  likes: Number,
  comments: Array,
});

const Post = mongoose.model("Post", postSchema, "Post");

// Post Routes
router.get("/", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          threadID: { $toObjectId: "$threadID" },
        },
      },
      {
        $lookup: {
          from: "Thread",
          localField: "threadID",
          foreignField: "_id",
          as: "threadData",
        },
      },
      {
        $project: {
          threadName: { $arrayElemAt: ["$threadData.threadName", 0] },
          author: "$author",
          content: "$content",
          likes: "$likes",
        },
      },
    ]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

module.exports = router;
