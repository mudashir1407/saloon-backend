const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

// CREATE BOOKING
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET ALL BOOKINGS (Admin later)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
