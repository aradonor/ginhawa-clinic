const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "doctor", "staff", "patient"], default: "patient" },
    phone: { type: String, default: "" },
    specialization: { type: String, default: "" },
    age: Number,
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    bloodType: { type: String, default: "N/A" },
    allergies: { type: String, default: "None" },
    address: { type: String, default: "", },
    emergencyContactName: { type: String, default: "" },
    emergencyContactPhone: { type: String, default: "" },
    isWalkIn: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);