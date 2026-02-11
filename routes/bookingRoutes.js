const express = require("express");
const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* CREATE BOOKING */
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* GET ALL BOOKINGS */
router.get("/", async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

/* UPDATE STATUS */
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ✅ NORMALIZE STATUS
    const previousStatus = booking.status.toLowerCase();
    const newStatus = req.body.status?.trim().toLowerCase();

    booking.status = newStatus;
    await booking.save();

    // ✅ SEND EMAIL ONLY ON COMPLETED
    if (previousStatus !== "completed" && newStatus === "completed") {
      const htmlEmail = `
      <div style="font-family:Arial; max-width:600px; margin:auto;">
        <div style="background:#000; padding:20px; text-align:center;">
          <img src="https://res.cloudinary.com/dkuptoepl/image/upload/v1770710970/my_logo_eyo2e3.png"
               style="max-width:140px" />
          <h2 style="color:#d4af37;">Mudash Salon & Spa</h2>
        </div>

        <div style="padding:20px;">
          <p>Hello <b>${booking.name}</b>,</p>
          <p>Your booking has been <b style="color:green;">confirmed</b> ✅</p>

          <p><b>Service:</b> ${booking.service}</p>
          <p><b>Date:</b> ${new Date(booking.date).toDateString()}</p>
          <p><b>Time:</b> ${booking.time}</p>

          <p style="margin-top:20px;">
            <a href="https://wa.me/2347015507655"
               style="background:#25D366;color:#fff;padding:12px 20px;
               text-decoration:none;border-radius:6px;">
               Chat with us on WhatsApp 💬
            </a>
          </p>

          <p><b>Mudash Salon & Spa</b><br/>Ilorin, Kwara</p>
        </div>
      </div>
      `;

      await sendEmail({
        to: booking.email,
        subject: "Your Salon Booking Is Confirmed ✅",
        html: htmlEmail,
      });

      console.log("📧 Email sent to:", booking.email);
    }

    res.json({ message: "Booking updated", booking });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* DELETE BOOKING */
router.delete("/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking deleted" });
});

module.exports = router;