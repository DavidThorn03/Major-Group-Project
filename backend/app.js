import express from "express";
import http from "http";
import { Server } from "socket.io";
import postRoutes from "./api/post.js";
import { handleCommentChangeStream, router as commentRoutes } from "./api/comment.js";
import userRoutes from "./api/user.js";
import threadRoutes from "./api/thread.js";
import connectDB from "./connect/db.js";
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
app.use("/post", postRoutes);
app.use("/user", userRoutes);
app.use("/comment", commentRoutes);
app.use("/thread", threadRoutes);

// Database Connection
connectDB();

// Start Real-Time Streams
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
