// backend/testConnection.js
import mongoose from "mongoose";
import Thread from "./models/Thread.js";

const MONGO_URI =
  "mongodb+srv://b00152842:kWDcbYMGg9IOfpEt@threadud.ga2og.mongodb.net/?retryWrites=true&w=majority&appName=ThreadUD"; // Replace with your actual MongoDB URI

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB!");
    const thread = await Thread.findById("67292eba16505c7370748e83");
    console.log("Found thread:", thread);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });
