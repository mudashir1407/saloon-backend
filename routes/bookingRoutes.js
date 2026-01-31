const express = require("express");
const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ============================
   ✅ CREATE Booking
============================ */
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      message: "Booking created successfully!",
      booking,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

/* ============================
   ✅ GET All Bookings
============================ */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ============================
   ✅ UPDATE Booking Status + Send Email
============================ */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ✅ Send Email When Completed
    if (req.body.status === "Completed") {
      await sendEmail(
        updated.email,
        "Booking Accepted ✅",
        `Hello ${updated.name},

Your salon booking has been accepted successfully 💇‍♀️✨

Thank you for choosing us.
See you soon!`
      );
    }

    res.status(200).json({
      message: "Booking updated successfully!",
      booking: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   ❌ DELETE Booking
============================ */
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      message: "Booking deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
