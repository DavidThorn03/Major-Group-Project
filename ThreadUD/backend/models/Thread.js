const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Thread title or name
  description: { type: String, required: true }, // Brief description of the thread
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Creator of the thread
  createdAt: { type: Date, default: Date.now }, // Creation date
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Posts associated with the thread
});

module.exports = mongoose.model("Thread", threadSchema);
