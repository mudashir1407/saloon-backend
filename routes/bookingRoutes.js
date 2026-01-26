const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

/* ✅ CREATE Booking */
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Booking created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ GET All Bookings */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ UPDATE Booking Status */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ DELETE Booking */
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

