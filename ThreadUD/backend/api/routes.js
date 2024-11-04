const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  threads: Array,
  comments: Array,
  post: Array,
  followThreads: Array,
  admin: Boolean
});

const User = mongoose.model("User", userSchema, "User");

router.get("/users", async (req, res) => {
  try {
    const filers = {};
    if(req.query.userName) {
      filers.userName = req.query.userName;
    }
    if(req.query.email) {
      filers.email = req.query.email;
    }
    const user = await User.find(filters);
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
    threads: req.body.threads,
    comments: req.body.comments,
    post: req.body.post,
    followThreads: req.body.followThreads,
    admin: req.body.admin
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
