const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  threadID: {
    type: mongoose.Schema.Types.ObjectId, // Ensures threadID is an ObjectId
    ref: "Thread", // References the Thread collection
    required: true,
  },
  postTitle: { type: String, required: true }, // Post title
  content: { type: String, required: true }, // Post content
  author: { type: String, required: true }, // Post author
  likes: { type: Array, default: [] }, // Array of likes
  comments: { type: Array, default: [] }, // Array of comments
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
