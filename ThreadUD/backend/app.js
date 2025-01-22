const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db"); // Database connection
const userRoutes = require("./api/user"); // User routes
const postRoutes = require("./api/post"); // Post routes
const threadRoutes = require("./api/thread"); // Thread routes

const app = express();

// Connect to MongoDB
connectDB(); // Ensures MongoDB is connected

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/user", userRoutes); // Handles user-related API requests
app.use("/api/post", postRoutes); // Handles post-related API requests
app.use("/api/threads", threadRoutes); // Handles thread-related API requests

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
