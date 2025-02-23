import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handlePostChangeStream, router as postRoutes } from "./api/post.js";
import { handleCommentChangeStream, router as commentRoutes } from "./api/comment.js";
import userRoutes from "./api/user.js";
import threadRoutes from "./api/thread.js";
import connectDB from "./config/db.js";
import cors from "cors";

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
app.use("/api/thread", threadRoutes);

// Database Connection
connectDB();

// Start Real-Time Streams
handlePostChangeStream(io);
handleCommentChangeStream(io);

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
