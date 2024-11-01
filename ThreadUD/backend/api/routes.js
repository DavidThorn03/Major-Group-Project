const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("test", testSchema);

router.get("/test", async (req, res) => {
  try {
    console.log("test");
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/items", async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
