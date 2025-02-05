const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  threadID: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" }, // Ensure threadID is stored as ObjectId
  threadName: String,
  postTitle: String,
  content: String,
  author: String,
  likes: [String],
  comments: [String],
});

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
