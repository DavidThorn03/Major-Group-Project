const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./backend/api/route.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", routes);

// Start Server
mongoose
  .connect("mongodb://localhost:27017/threadUD", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
