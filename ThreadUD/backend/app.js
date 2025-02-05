const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { handlePostChangeStream, router: postRoutes } = require("./api/post");
const commentRoutes = require("./api/comment");
const userRoutes = require("./api/user");
const threadRoutes = require("./api/thread"); // Added thread routes
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, adjust this for production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/thread", threadRoutes); // Added thread routes

// Database Connection
connectDB();

// Start Real-Time Streams
handlePostChangeStream(io);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// Start Server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
