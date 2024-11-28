const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  year: { type: Number, required: true },
  course: { type: String, required: true },
  threads: { type: Array, default: [] },
  posts: { type: Array, default: [] },
  comments: { type: Array, default: [] },
  followedThreads: { type: Array, default: [] },
  likedPosts: { type: Array, default: [] },
  likedComments: { type: Array, default: [] },
});

const Student = mongoose.model("Student", studentSchema, "Student");

// POST /students/register
router.post("/students/register", async (req, res) => {
  const { name, email, password, year, course } = req.body;

  // Validate required fields
  if (!name || !email || !password || !year || !course) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Create and save the student
    const newStudent = new Student({
      name,
      email,
      password,
      year,
      course,
    });

    const savedStudent = await newStudent.save();
register
    res.status(201).json({
      message: "Student registered successfully.",
      student: savedStudent,
    });
main
  } catch (error) {
    console.error("Error registering student:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the student." });
  }
});

module.exports = router;
