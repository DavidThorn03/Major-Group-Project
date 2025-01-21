const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  }, // Associated thread
  content: { type: String, required: true }, // Post content
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Creator of the post
  createdAt: { type: Date, default: Date.now }, // Creation date
});

module.exports = mongoose.model("Post", postSchema);
