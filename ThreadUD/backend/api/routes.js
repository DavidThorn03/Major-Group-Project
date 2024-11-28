const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  course: String,
  year: Number,
  threads: Array,
  comments: Array,
  post: Array,
  followThreads: Array,
  admin: Boolean,
});

const User = mongoose.model("User", userSchema, "User");

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

// User Routes
router.get("/users", async (req, res) => {
  let un = req.query.userName;
  let pass = req.query.password;

  try {
    const user = await User.findOne({ userName: un, password: pass }).exec();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/users", async (req, res) => {
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    course: req.body.course,
    year: req.body.year,
    threads: req.body.threads,
    comments: req.body.comments,
    post: req.body.post,
    followThreads: req.body.followThreads,
    admin: req.body.admin,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Post Routes
router.get("/posts", async (req, res) => {
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
