const mongoose = require("mongoose");

const uri =
  "mongodb+srv://b00152842:kWDcbYMGg9IOfpEt@threadud.ga2og.mongodb.net/?retryWrites=true&w=majority&appName=ThreadUD"; // Replace with your MongoDB connection string
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");

    const Post = mongoose.connection.collection("Post");
    const Thread = mongoose.connection.collection("Thread");

    const posts = await Post.find({}).toArray();
    const threads = await Thread.find({}).toArray();

    console.log("Posts:", posts);
    console.log("Threads:", threads);

    process.exit(); // Exit the script
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
