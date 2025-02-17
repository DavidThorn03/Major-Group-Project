import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js"; // Import the User model
import nodemailer from "nodemailer";

const router = express.Router();

// POST /user/register
router.post("/register", async (req, res) => {
  const { userName, email, password, year, course } = req.body;
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
        user: 'davythornton@gmail.com',
        pass: 'enter password here'
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
  

export default router;
