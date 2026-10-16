const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Public: the "Contact Us" form on the landing site posts here.
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, message } = req.body;
    if (![firstName, lastName, mobile, email, message].every((v) => v && String(v).trim())) {
      return res.status(400).json({ message: "Please fill in every field." });
    }
    await Message.create({ firstName, lastName, mobile, email, message });
    res.status(201).json({ message: "Message received." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
