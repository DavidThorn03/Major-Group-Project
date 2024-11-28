const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// User Schema
const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  course: String,
  year: Number,
  threads: Array,
  comments: Array,
  posts: Array,
  followThreads: Array,
  admin: Boolean,
});

const User = mongoose.model("User", userSchema, "User");

// Route: Fetch user with filters
router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const user = await User.findOne(filters).exec();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Route: Create a new user
router.post("/", async (req, res) => {
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    course: req.body.course,
    year: req.body.year,
    threads: req.body.threads || [],
    comments: req.body.comments || [],
    posts: req.body.posts || [],
    followThreads: req.body.followThreads || [],
    admin: req.body.admin || false,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

module.exports = router;
