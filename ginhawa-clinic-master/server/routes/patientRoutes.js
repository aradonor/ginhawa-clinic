const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");
const Prescription = require("../models/Prescription");
const Billing = require("../models/Billing");

router.get("/dashboard-summary", protect, async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await Appointment.find({ patient: patientId });
    const prescriptions = await Prescription.find({ patient: patientId, status: "Active" });
    const records = await MedicalRecord.find({ patient: patientId });

    const upcoming = appointments.filter(a => a.status === "Pending" || a.status === "Confirmed");

    res.json({
      metrics: {
        upcomingCount: upcoming.length,
        activePrescriptionsCount: prescriptions.length,
        consultationsCount: records.length,
      },
      nextAppointment: upcoming[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/appointments", protect, async (req, res) => {
  try {
    const { doctorName, date, time, reason } = req.body;
    const newAppointment = await Appointment.create({
      patient: req.user.id,
      doctorName,
      date,
      time,
      reason,
      status: "Pending"
    });
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/appointments", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/records", protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/prescriptions", protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/billing", protect, async (req, res) => {
  try {
    const patientId = req.user.id || req.user._id;
    const bills = await Billing.find({ patient: patientId });
    res.json(bills);
  } catch (error) {
    console.error("Fetch billing error:", error);
    res.status(500).json({ message: "Failed to fetch billing records", error: error.message });
  }
});

module.exports = router;