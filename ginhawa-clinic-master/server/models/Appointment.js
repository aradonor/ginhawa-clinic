const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, 
  doctorName: { type: String, required: true },
  date: { type: String, required: true }, 
  time: { type: String, required: true },
  reason: { type: String, default: "General Consultation" },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Checked-In", "Triaged", "Completed", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);