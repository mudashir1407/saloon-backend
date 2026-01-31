const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    service: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      require: false

    },
    status: {
      type: String,
      default: "pending"
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
