const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  threadName: { type: String, required: true }, // Name of the thread
  year: { type: Number, required: true }, // Year associated with the thread
  course: { type: String, required: true }, // Course related to the thread
  createdAt: { type: Date, default: Date.now }, // Creation date
});

// Prevent overwriting the model if it already exists
module.exports =
  mongoose.models.Thread || mongoose.model("Thread", threadSchema);
