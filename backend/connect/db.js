import mongoose from "mongoose";
import Post from "../models/Post.js"; // Ensure the Post model is properly imported
import dotenv from "dotenv";
dotenv.config();
// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTSTRING);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Function to fetch posts for a specific thread
export const getPostsByThread = async (threadID) => {
  try {
    // Ensure threadID is correctly converted to ObjectId
    const posts = await Post.find({
      threadID: new mongoose.Types.ObjectId(threadID),
    });

    console.log(`Posts fetched for threadID ${threadID}:`, posts);
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for threadID ${threadID}:`, error);
    return []; // Return empty array in case of error
  }
};

// Export database connection function
export default connectDB;
