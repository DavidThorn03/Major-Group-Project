// user.js
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

// User Routes
router.get("/", async (req, res) => {
  const { userName, password } = req.query;

  try {
    const user = await User.findOne({ userName, password }).exec();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
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

module.exports = router;
