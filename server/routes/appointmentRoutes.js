const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Appointment = require("../models/Appointment"); 
const { protect } = require("../middleware/authMiddleware");

const getConsultationFee = (reason) => {
  switch (reason) {
    case "Consultation": return 500;
    case "Follow-up": return 300;
    case "Medical Certificate": return 400;
    default: return 500;
  }
};

router.post("/book", protect, async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason } = req.body;
    
    const fee = getConsultationFee(reason);

    const newAppointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      reason,
      consultationFee: fee,
      status: "Pending"
    });

    await Billing.create({
      patient: patientId,
      amount: fee,
      description: `${reason} Fee`,
      status: "Unpaid",
      date: new Date().toISOString().split("T")[0]
    });

    res.status(201).json({ message: "Appointment booked successfully!", newAppointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/doctors", protect, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("name email specialization");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    console.log("Appointment booking requested for doctorId:", doctorId);
    console.log("Booked by patient ID:", req.user.id);

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "Doctor, date, and time are required" });
    }

    const selectedDoctor = await User.findById(doctorId);
    if (!selectedDoctor) {
      return res.status(404).json({ message: "Selected doctor not found" });
    }

    const newAppointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      doctorName: selectedDoctor.name,
      date,
      time,
      reason: reason || "General Checkup",
      status: "Pending",
    });

    console.log("Successfully created appointment in DB:", newAppointment);
    res.status(201).json({ message: "Appointment booked successfully!", appointment: newAppointment });
  } catch (error) {
    console.error("Booking Error Details:", error);
    res.status(500).json({ message: "Failed to book appointment", error: error.message });
  }
});

module.exports = router;