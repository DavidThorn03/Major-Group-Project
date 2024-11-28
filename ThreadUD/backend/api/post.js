const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Post Schema
const postSchema = new mongoose.Schema({
  _id: String,
  threadID: String,
  threadName: String,
  postTitle: String,
  content: String,
  author: String,
  likes: Array,
  comments: Array,
});

const Post = mongoose.model("Post", postSchema, "Post");

// Route: Fetch all posts with thread details
router.get("/", async (req, res) => {
  console.log("in api");
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
          postTitle: "$postTitle",
          author: "$author",
          content: "$content",
          likes: "$likes",
          comments: "$comments",
        },
      },
    ]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

module.exports = router;
