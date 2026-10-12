const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorName: { type: String, required: true },
  medicines: [
    {
      medication: String,
      quantity: Number,
      dosage: String,
      instructions: String,
      price: Number,
      totalAmount: Number
    }
  ],
  status: { type: String, default: "Active" },
  date: { type: String, default: () => new Date().toISOString().split("T")[0] }
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);