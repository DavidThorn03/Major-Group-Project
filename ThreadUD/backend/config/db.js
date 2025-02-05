const mongoose = require("mongoose");
const posts = await Post.find({ threadID: mongoose.Types.ObjectId(threadId) });

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://b00152842:kWDcbYMGg9IOfpEt@threadud.ga2og.mongodb.net/?retryWrites=true&w=majority&appName=ThreadUD"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
