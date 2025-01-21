const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const threadRoutes = require("./api/thread");

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/threadUD", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit with failure
  }
};
connectDB();

// Define routes
app.use("/api", threadRoutes); // Use the thread-related routes

// Default route for health check
app.get("/", (req, res) => {
  res.send("ThreadUD Backend is running!");
});

// Start the server
const PORT = 5000; // Default port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
