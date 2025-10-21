import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    year: { type: Number, required: true },
    course: { type: String, required: true },
    threads: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Thread",
      default: [],
    },
    auth: { type: Boolean, default: false },
  },
  {
    collection: "User", 
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
