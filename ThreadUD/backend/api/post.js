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
    return posts;
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

router.put("/likes", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const post = req.body.post;
  const likes = req.body.likes;

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { postTitle: post }, 
      { likes: likes }, 
      { new: true }  
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Updated Post:", updatedPost);
    res.json(updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/comments", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const post = req.body.post;
  const comments = req.body.comments;

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: post }, 
      { comments: comments }, 
      { new: true }  
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Updated Post:", updatedPost);
    res.json(updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
