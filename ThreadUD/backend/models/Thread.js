const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  threadName: { type: String, required: true, unique: true, index: true }, // Unique and indexed
  year: { type: Number, required: true, min: 1, max: 5, index: true }, // Year validation
  course: { type: String, required: true, minlength: 3, maxlength: 100 }, // Course validation
  createdAt: { type: Date, default: Date.now }, // Creation date
});

// Add virtual for formatted date
threadSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US");
});

// Ensure virtuals are included in JSON responses
threadSchema.set("toJSON", { virtuals: true });

// Prevent overwriting the model if it already exists
module.exports =
  mongoose.models.Thread || mongoose.model("Thread", threadSchema);
