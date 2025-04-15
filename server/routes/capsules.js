const express = require("express");
const router = express.Router();
const Capsule = require("../models/Capsule");

// GET all capsules
router.get("/", async (req, res) => {
  try {
    const capsules = await Capsule.find();
    console.log("Fetching capsules from database:", capsules);
    res.json(capsules);
  } catch (err) {
    console.error("Error fetching capsules:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new capsule
router.post("/", async (req, res) => {
  try {
    console.log("Received capsule data:", req.body);
    const newCapsule = new Capsule(req.body);
    const savedCapsule = await newCapsule.save();
    console.log("Saved capsule to database:", savedCapsule);
    res.status(201).json(savedCapsule);
  } catch (err) {
    console.error("Error creating capsule:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a capsule
router.delete("/:id", async (req, res) => {
  try {
    const capsule = await Capsule.findByIdAndDelete(req.params.id);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }
    res.json({ message: "Capsule deleted successfully" });
  } catch (err) {
    console.error("Error deleting capsule:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
