const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { handlePostChangeStream, router: postRoutes } = require("./api/post");
const { handleCommentChangeStream, router: commentRoutes } = require("./api/comment");
const userRoutes = require("./api/user");
const connectDB = require("./config/db");


const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", commentRoutes)

// Database Connection
connectDB();

// Start Real-Time Streams
handlePostChangeStream(io);
handleCommentChangeStream(io);


// Start Server
server.listen(3000, () => {
    console.log("Server listening");
});
