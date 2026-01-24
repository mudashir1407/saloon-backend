const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.get("/", (req, res) => {
  res.send("Combs Salon Backend is running 🚀");
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  // simple admin check
  if (email === "admin@combs.com.com" && password === "123456") {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid login details" });
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bookings", bookingRoutes);

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
