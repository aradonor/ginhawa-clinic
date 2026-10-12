const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");
const Prescription = require("../models/Prescription");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Inventory = require("../models/Inventory");
const bcrypt = require("bcryptjs");
const Billing = require("../models/Billing");

router.get("/dashboard", protect, async (req, res) => {
  try {
    const doctorId = req.user._id || req.user.id;
    const appointments = await Appointment.find({ doctor: doctorId });

    const pendingRequests = appointments.filter(app => app.status === "Pending").length;
    const scheduledToday = appointments.filter(app => app.date === new Date().toISOString().split("T")[0]).length;
    const attendedPatients = appointments.filter(app => app.status === "Completed").length;

    res.json({
      pendingRequests,
      scheduledToday,
      attendedPatients,
      totalAppointments: appointments.length
    });
  } catch (error) {
    console.error("Fetch dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard overview", error: error.message });
  }
});

router.get("/appointments", protect, async (req, res) => {
  try {
    const doctorId = req.user._id || req.user.id;
    const appointments = await Appointment.find({ doctor: doctorId }).populate("patient", "name email");
    res.json(appointments);
  } catch (error) {
    console.error("Fetch doctor appointments error:", error);
    res.status(500).json({ message: "Failed to fetch doctor appointments", error: error.message });
  }
});

router.post("/records", protect, async (req, res) => {
  try {
    const { patientId, diagnosis, notes } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({ message: "Patient selection and diagnosis are required" });
    }

    const newRecord = await MedicalRecord.create({
      patient: patientId,
      doctor: req.user.id,
      doctorName: req.user.name, 
      diagnosis,
      notes,
      date: new Date().toISOString().split("T")[0],
    });

    res.status(201).json({ message: "Medical record saved successfully!", record: newRecord });
  } catch (error) {
    console.error("Save record error:", error);
    res.status(500).json({ message: "Failed to save record", error: error.message });
  }
});

router.post("/prescriptions", protect, async (req, res) => {
  try {
    const { patientId, medication, quantity, dosage, instructions } = req.body;

    const medicine = await Inventory.findOne({ 
      $or: [{ itemName: medication }, { name: medication }] 
    });

    if (!medicine) {
      return res.status(404).json({ message: "Selected medicine not found in inventory." });
    }

    const currentStock = medicine.stockQuantity !== undefined ? medicine.stockQuantity : medicine.stock;
    const stockField = medicine.stockQuantity !== undefined ? "stockQuantity" : "stock";

    if (currentStock < Number(quantity)) {
      return res.status(400).json({ message: `Insufficient stock for ${medication}. Remaining: ${currentStock}` });
    }

    // 1. Calculate medicine cost
    const unitPrice = medicine.unitPrice || medicine.price || medicine.cost || 0;
    const medicineTotal = unitPrice * Number(quantity);

    // 2. Find appointment and determine fee
    const latestAppointment = await Appointment.findOne({ patient: patientId }).sort({ createdAt: -1 });
    
    let consultationFee = 500; 
    let visitReason = "Consultation";

    if (latestAppointment && latestAppointment.reason) {
      const lowerReason = latestAppointment.reason.toLowerCase();
      if (lowerReason.includes("follow-up") || lowerReason.includes("follow up")) {
        visitReason = "Follow-up Checkup";
        consultationFee = 300;
      } else if (lowerReason.includes("checkup")) {
        visitReason = "Checkup";
        consultationFee = 500;
      } else {
        visitReason = "Consultation";
        consultationFee = 500;
      }
    }

    const grandTotal = consultationFee + medicineTotal;

    medicine[stockField] -= Number(quantity);
    await medicine.save();

    // 3. Create Prescription record
    const newPrescription = await Prescription.create({
      patient: patientId,
      doctor: req.user.id || req.user._id,
      doctorName: req.user.name,
      medicines: [
        {
          medication: medication,
          quantity: Number(quantity),
          dosage: dosage,
          instructions: instructions,
          price: unitPrice,
          totalAmount: medicineTotal
        }
      ],
      status: "Active",
      date: new Date().toISOString().split("T")[0]
    });

    // 4. Create Billing record with itemized rows
    await Billing.create({
      patient: patientId,
      amount: grandTotal,
      totalAmount: grandTotal,
      status: "Unpaid",
      paymentStatus: "Unpaid",
      date: new Date().toISOString().split("T")[0],
      items: [
        {
          description: visitReason,
          amount: consultationFee
        },
        {
          description: `${medication} (x${quantity})`,
          amount: medicineTotal
        }
      ]
    });

    res.status(201).json({ message: "Prescription issued and billing record generated successfully!", newPrescription });
  } catch (error) {
    console.error("Prescription route error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get doctor profile
router.get("/profile", protect, async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id || req.user._id).select("-password");
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const doctor = await User.findById(req.user.id || req.user._id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(newPassword, salt);

    await doctor.save();
    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;