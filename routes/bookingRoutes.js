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
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      ">
      
        <!-- HEADER -->
        <div style="background:#000; padding:20px; text-align:center;">
          <img 
            src="https://res.cloudinary.com/dkuptoepl/image/upload/v1770710970/my_logo_eyo2e3.png" 
            alt="Mudash Salon & Spa Logo"
            style="max-width:140px; margin-bottom:10px;"
          />
          <h2 style="color:#d4af37; margin:0;">Mudash Salon & Spa</h2>
        </div>
      
        <!-- BODY -->
        <div style="padding:25px; color:#333;">
          <p>Hello <b>${booking.name}</b>,</p>
      
          <p>
            Your salon booking has been 
            <span style="color:green; font-weight:bold;">accepted</span> ✅
          </p>
      
          <table style="width:100%; margin-top:15px; border-collapse:collapse;">
            <tr>
              <td style="padding:8px;"><b>Service</b></td>
              <td style="padding:8px;">${booking.service}</td>
            </tr>
            <tr>
              <td style="padding:8px;"><b>Date</b></td>
              <td style="padding:8px;">${new Date(booking.date).toDateString()}</td>
            </tr>
            <tr>
              <td style="padding:8px;"><b>Time</b></td>
              <td style="padding:8px;">${booking.time}</td>
            </tr>
          </table>
      
          <p style="margin-top:20px;">
            We can’t wait to take care of you 💇‍♀️✨
          </p>
      
          <!-- WhatsApp Button -->
          <p style="text-align:center; margin-top:25px;">
            <a href="https://wa.me/2347015507655" 
               style="
                 display:inline-block;
                 padding:12px 20px;
                 background:#25D366;
                 color:#ffffff;
                 text-decoration:none;
                 border-radius:6px;
                 font-weight:bold;
                 font-family: Arial, sans-serif;
               ">
              Chat with Us on WhatsApp 💬
            </a>
          </p>
      
          <p>
            <b>Mudash Salon & Spa</b><br/>
            Ilorin, Kwara
          </p>
        </div>
      
        <!-- FOOTER -->
        <div style="
          background:#f8f8f8;
          padding:15px;
          text-align:center;
          font-size:13px;
          color:#777;
        ">
          © ${new Date().getFullYear()} Mudash Salon & Spa. All rights reserved.
        </div>
      
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
