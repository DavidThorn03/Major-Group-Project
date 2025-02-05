const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Post Schema
const postSchema = new mongoose.Schema(
  {
    threadID: String,
    threadName: String,
    postTitle: String,
    content: String,
    author: String,
    likes: Array,
    comments: Array
  },{ versionKey: false } 
);

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
  const like = req.body.like;
  const action = req.body.action;

  try {
    let updatedQuery = {};

    if (action == -1) {
      updatedQuery = { $pull: { likes: like } };
    }
    else {
      updatedQuery = { $push: { likes: like } };
    }

    const updatedPost = await Post.findOneAndUpdate(
      { postTitle: post }, 
      updatedQuery, 
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

router.put("/comments", async (req, res) => {   // THIS WORKS FINE, OTHERS ARE PROBLEM
  console.log("Query Parameters:", req.body);

  const post = req.body.post;
  const comment = req.body.comment;
  const action = req.body.action;

  try {
    let updatedQuery = {};

    if (action == -1) {
      updatedQuery = { $pull: { comments: comment } };
    }
    else {
      updatedQuery = { $push: { comments: comment } };
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: post }, 
      updatedQuery, 
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


router.get("/single", async (req, res) => { // this is used when the page is first loaded to get the CURRENT post informtion
  console.log("in api");
  const id = req.query.id;
  try {
    const posts = await getSinglePost(id);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

const getSinglePost = async (id) => {
  console.log("Fetching post with id:", id);

  try {
    const post = await Post.findOne({ _id: id }).exec(); 
    if (!post) {
      throw new Error("Post not found");
    }
    console.log("Fetched post:", post);
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error; 
  }
};


const handlePostChangeStream = (io) => { // and then this is use to get any new informtion that relates to the same query
  const changeStream = Post.watch();

  changeStream.on("change", async (next) => {
    try {
      //console.log("Change detected in Post collection:", next);

      if (next.operationType === "insert" || next.operationType === "update" || next.operationType === "delete") {
        const updatedPosts = await getPostsWithThreadDetails();
        io.emit("update posts", updatedPosts);
        //console.log("Emitted updated posts");
      }
    } catch (error) {
      //console.error("Error processing Post change stream:", error);
    }
  });
};


module.exports = { Post, handlePostChangeStream, router, getSinglePost };
