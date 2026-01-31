const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

/* ✅ MIDDLEWARE MUST COME FIRST */
app.use(
  cors({
    origin: "*", // allow frontend from anywhere (GitHub Pages)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

/* ✅ TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Combs Salon Backend is running 🚀");
});

/* ✅ ADMIN LOGIN */
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "mudashirsa@gmail.com" && password === "123456") {
    res.json({
      success: true,
      message: "Admin login successful",
    });
  } else {
    res.status(401).json({ error: "Invalid login details" });
  }
});

/* ✅ BOOKING ROUTES */
app.use("/api/bookings", bookingRoutes);

/* ✅ DATABASE CONNECTION */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error:", err));

/* ✅ PORT (Render uses 10000 automatically) */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} 🚀`)
);

