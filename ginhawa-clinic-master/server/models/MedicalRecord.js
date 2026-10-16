const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  notes: String,
  icd10Code: String,
  vitals: {
    bloodPressure: String,
    temperature: String,
    weight: String
  }
}, { timestamps: true });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);