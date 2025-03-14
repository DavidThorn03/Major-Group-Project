import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js"; // Import the User model
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Thread from "../models/Thread.js";
import nodemailer from "nodemailer";
import emailPass from "../../config/Emailpass.js";
import verifyOTP from "./verifyOTP.js";

const router = express.Router();

// POST /user/register
router.post("/register", async (req, res) => {
  const { userName, email, password, year, course, auth } = req.body;
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  // Validate required fields
  if (!userName || !email || !password || !year || !course) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const newUser = await User.create({
      userName,
      email,
      password: hash,
      year,
      course,
      auth,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
});

// GET /user
router.get("/", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashResult = bcrypt.compareSync(password, user.password);
    if (!hashResult) {
      return res.status(401).json({ message: "Incorrect password entered." });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the user." });
  }
});

// PUT /user/:userId/joinThread
router.put("/:userId/joinThread", async (req, res) => {
  const { userId } = req.params;
  const { threadId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.threads.includes(threadId)) {
      return res
        .status(400)
        .json({ message: "User already joined the thread." });
    }

    user.threads.push(threadId);
    await user.save();

    res
      .status(200)
      .json({ message: "Thread added to user's joined threads", user });
  } catch (error) {
    console.error("Error joining thread:", error);
    res.status(500).json({ message: "Error joining thread", error });
  }
});

// PUT /user/:userId/leaveThread
router.put("/:userId/leaveThread", async (req, res) => {
  const { userId } = req.params;
  const { threadId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.threads.includes(threadId)) {
      return res.status(400).json({ message: "User is not in this thread." });
    }

    user.threads = user.threads.filter((id) => id.toString() !== threadId);
    await user.save();

    res.status(200).json({ message: "User left the thread", user });
  } catch (error) {
    console.error("Error leaving thread:", error);
    res.status(500).json({ message: "Error leaving thread", error });
  }
});

router.put("/password", async (req, res) => {
  console.log("req.body", req.body);
  const { email, password } = req.body;
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { password: hash },
      { new: true } 
    );
    
    if (!updatedUser) {	
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
});

router.get("/forgotPassword", async (req, res) => {

    const user = req.query.email;
    const code = req.query.code;
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'threadud123@gmail.com',
        pass: emailPass
      }
    });
    
    var mailOptions = {
      from: '"ThreadUD" <davythornton@gmail.com>',
      to: user,
      subject: 'Password Reset',
      text: 'To reset your password, please enter the following code: ' + code
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  
    return Response.json({message: 'Email sent'})
  
});

router.put("/update", async (req, res) => {
  console.log("req.body", req.body);
  const email = req.body.email;
  const update = req.body.update;

  if (!email) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { userName: update.userName, year: update.year, course: update.course },
      { new: true } 
    );
    if (!updatedUser) {	
      return res.status(404).json({ message: "User not found" });
    }
    console.log("updatedUser", updatedUser);

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
});

router.get("/posts", async (req, res) => {
  const author = req.query.author;

  try {
    const posts = await Post.find({ author: author }).exec();
    if (!posts) {
      return res.status(404).json({ message: "Posts not found." });
    }
    
    return res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the posts." });
  }
});

router.get("/checkPassword", async (req, res) => {
  const userPassword = req.query.password;
  const enteredPassword = req.query.enteredPassword;

  try {
    const hashResult = bcrypt.compareSync(enteredPassword, userPassword);
    console.log("hashResult", hashResult);

    return res.json({ result: hashResult });
  } catch (error) {
    console.error("Error checking password:", error);
    res
      .status(500)
      .json({ message: "An error occurred while checking the password." });

  }
});

router.get("/threads", async (req, res) => {
  console.log("Query Parameters:", req.query);
  let { threadIDs } = req.query; 
  
  if (!threadIDs) {
    return res.status(404).json({ message: "threadIDs parameter is required" });
  }

  if (!Array.isArray(threadIDs)) {
    threadIDs = threadIDs.split(","); 
  }

  if (threadIDs.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(402).json({ message: "Invalid threadIDs format" });
  }

  try {
    const threads = await Thread.find({ _id: { $in: threadIDs } });
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Error fetching threads", error });
  }
});


router.get("/search", async (req, res) => {
  console.log("Query Parameters:", req);

  const name = req.query.name;

  try {
    const threads = await Thread.find({
      threadName: { $regex: name, $options: "i" },
    });
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Error fetching threads", error });
  }
});

router.get("/auth", async (req, res) => {
  console.log("Query Parameters:", req.query.code);

  const usercode = req.query.code;

  const result = await verifyOTP(usercode);
  
  res.json({ result });
});


  

export default router;
