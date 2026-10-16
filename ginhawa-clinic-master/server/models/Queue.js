const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  vitals: {
    bp: String,
    temperature: String,
    heartRate: String,
    weight: String,
    height: String,
    chiefComplaint: String,
  },
  status: {
    type: String,
    enum: ["Waiting", "In Triage", "Ready for Doctor", "In Consultation", "Completed", "Cancelled"],
    default: "Waiting",
  },
  doctor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false
},
}, { timestamps: true });

module.exports = mongoose.model("Queue", queueSchema);