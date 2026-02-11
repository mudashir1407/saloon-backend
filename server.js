const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mudash Salon Backend is running 🚀");
});

app.post("/api/admin/login", (req, res) => {
  if (req.body.email === "mudashirsa@gmail.com" && req.body.password === "123456") {
    return res.json({ success: true });
  }
  res.status(401).json({ error: "Invalid login" });
});

app.use("/api/bookings", bookingRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(console.error);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
