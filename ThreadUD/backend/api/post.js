const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

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

const getPostsWithThreadDetails = async () => { // think if this as the query you need to get the right info
  return await Post.aggregate([
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
};

router.get("/", async (req, res) => { // this is used when the page is first loaded to get the CURRENT post informtion
  console.log("in api");
  try {
    const posts = await getPostsWithThreadDetails();
    res.json(posts);
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
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/comments", async (req, res) => {
  console.log("Query Parameters:", req.body);

  const post = req.body.post;
  const comments = req.body.comments;
  console.log("post", post);
  console.log("comments", comments);

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { postTitle: post }, 
      { comments: comments }, 
      { new: true }  
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Updated Post:", updatedPost);
    res.json(updatedPost);
    return updatedPost._id;
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: error.message });
  }
});



const handlePostChangeStream = (io) => { // and then this is use to get any new informtion that relates to the same query
  const changeStream = Post.watch();

  changeStream.on("change", async (next) => {
    try {
      console.log("Change detected in Post collection:", next);

      if (next.operationType === "insert" || next.operationType === "update" || next.operationType === "delete") {
        const updatedPosts = await getPostsWithThreadDetails();
        io.emit("update posts", updatedPosts);
        console.log("Emitted updated posts");
      }
    } catch (error) {
      console.error("Error processing Post change stream:", error);
    }
  });
};


module.exports = { Post, handlePostChangeStream, router };
