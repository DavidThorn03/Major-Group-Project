import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  threadName: { type: String, required: true, unique: true, index: true },
  year: { type: Number, required: true, min: 1, max: 5, index: true },
  course: { type: String, required: true, minlength: 3, maxlength: 100 },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false }
);

threadSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US");
});

threadSchema.set("toJSON", { virtuals: true });

const Thread =
  mongoose.models.Thread || mongoose.model("Thread", threadSchema, "Thread");

export default Thread;
