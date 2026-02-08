const express = require("express");
const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ✅ CREATE Booking */
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
router.put("/:id", async (req, res) => {
  try {
    console.log("🟡 Incoming status:", req.body.status);

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    console.log("🟡 Previous status:", booking.status);

    const previousStatus = booking.status;
    const newStatus = req.body.status?.trim();

    booking.status = newStatus;
    await booking.save();

    // ✅ Send email ONLY when status changes to Completed
    if (
      previousStatus !== "Completed" &&
      newStatus?.toLowerCase() === "completed"
    ) {
      console.log("📤 Sending email to:", booking.email);

      const htmlEmail = `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2 style="color:#d4af37;">Booking Confirmed ✨</h2>
          <p>Hello <b>${booking.name}</b>,</p>

          <p>Your salon booking has been <b>successfully accepted</b>.</p>

          <table style="margin-top:10px;">
            <tr><td><b>Service:</b></td><td>${booking.service}</td></tr>
            <tr><td><b>Date:</b></td><td>${new Date(booking.date).toDateString()}</td></tr>
            <tr><td><b>Time:</b></td><td>${booking.time}</td></tr>
          </table>

          <p style="margin-top:15px;">
            We look forward to seeing you 💇‍♀️💇‍♂️
          </p>

          <p>
            <b>Salon & Spa</b><br/>
            Ilorin, Kwara
          </p>
        </div>
      `;

      await sendEmail({
        to: booking.email,
        subject: "Your Salon Booking Is Confirmed ✅",
        html: htmlEmail,
      });

      console.log("📧 Booking completion email sent to:", booking.email);
    }

    res.json({ message: "Booking updated", booking });
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ❌ DELETE Booking */
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
