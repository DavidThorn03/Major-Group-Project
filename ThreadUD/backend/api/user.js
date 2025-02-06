import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const router = express.Router();

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    year: { type: Number, required: true },
    course: { type: String, required: true },
    threads: { type: Array, default: [] },
    posts: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    followedThreads: { type: Array, default: [] },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema, "User");

// POST /students/register
router.post("/students/register", async (req, res) => {
  const { userName, email, password, year, course } = req.body;
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  // Validate required fields
  if (!userName || !email || !password || !year || !course) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if email already exists
    const existingStudent = await User.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const savedStudent = await User.create({
      userName: userName,
      email: email,
      password: hash,
      year: year,
      course: course,
      comments: [],
      threads: [],
      posts: [],
      followedThreads: [],
    });
    res.status(201).json({
      message: "Student registered successfully.",
      student: savedStudent,
    });
  } catch (error) {
    console.error("Error registering student:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the student." });
  }
});

router.get("/student", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  console.log("email", email);
  console.log("password", password);
  try {
    const student = await User.findOne({ email: email }).exec();
    let hashResult = bcrypt.compareSync(password, student.password);
    if (hashResult) {
      return res.json(student);
    }
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Incorrect password entered." });
  } catch (error) {
    console.error("Error fetching student:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the student." });
  }
});

export default router;
