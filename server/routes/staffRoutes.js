const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");

const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Queue = require("../models/Queue");
const Invoice = require("../models/Billing");

router.get("/dashboard", protect, async (req, res) => {
  try {
    const totalAppointmentsToday = await Appointment.countDocuments({
      status: { $ne: "Cancelled" }
    });

    const activeQueueCount = await Queue.countDocuments({
      status: { $in: ["Waiting", "In Triage", "Ready for Doctor"] }
    });

    const walkInsToday = await User.countDocuments({
      role: "patient",
      isWalkIn: true
    });

    // Handle Invoice vs Billing model collection names safely
    const BillingModel = typeof Invoice !== 'undefined' ? Invoice : Billing;
    const paidInvoicesToday = await BillingModel.find({
      status: "Paid"
    });
    const totalRevenueToday = paidInvoicesToday.reduce((acc, inv) => acc + (inv.totalAmount || inv.amount || 0), 0);

    res.json({
      todayAppointments: totalAppointmentsToday,
      activeQueue: activeQueueCount,
      walkInsRegistered: walkInsToday,
      todaysRevenue: totalRevenueToday
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/appointments", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/appointments/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();
    res.json({ message: "Appointment status updated successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/register-walkin", protect, async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, address, doctorId, doctorName, reason } = req.body;

    // 1. Check if user account already exists by email
    let user = await User.findOne({ email });

    if (!user) {
      // FIX: Check if password is provided and not empty, otherwise use default
      const plainPassword = (password && password.trim() !== "") ? password : "paass123";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      // 2. Create user login account with the guaranteed hashed password
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        age,
        gender,
        address,
        role: "patient",
        isWalkIn: true
      });
    }

    // 3. Create the appointment
    const todayStr = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().slice(0, 5);

    await Appointment.create({
      patient: user._id,
      doctor: doctorId || undefined,
      doctorName: "Unassigned", 
      date: todayStr,
      time: currentTime,
      reason: reason || "Walk-in Consultation",
      status: "Confirmed"
    });

    res.status(201).json({ message: "Walk-in registered and login account created successfully!", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/queue", protect, async (req, res) => {
  try {
    const queueItems = await Queue.find()
      .populate("patient", "name email phone")
      .sort({ createdAt: -1 });
    res.json(queueItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/triage", protect, async (req, res) => {
  try {
    const { patientId, doctorId, bp, temperature, heartRate, weight, height, chiefComplaint } = req.body;

    const triageRecord = await Queue.create({
      patient: patientId,
      doctor: doctorId && doctorId !== "" ? doctorId : undefined,
      vitals: { bp, temperature, heartRate, weight, height, chiefComplaint },
      status: "Ready for Doctor"
    });

    res.status(201).json({ message: "Triage recorded and patient added to queue", triageRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/queue/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const queueItem = await Queue.findById(req.params.id);
    if (!queueItem) {
      return res.status(404).json({ message: "Queue record not found" });
    }

    queueItem.status = status;
    await queueItem.save();
    res.json({ message: "Queue status updated", queueItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/patients", protect, async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password").sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/billing", protect, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("patient", "name email phone")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/billing", protect, async (req, res) => {
  try {
    const { patientId, doctorId, items, totalAmount } = req.body;
    
    const newInvoice = await Invoice.create({
      patient: patientId,
      doctor: doctorId,
      items,
      totalAmount,
      status: "Unpaid"
    });

    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/billing/:id/pay", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.status = "Paid";
    invoice.paidAt = Date.now();
    await invoice.save();

    res.json({ message: "Payment recorded successfully", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Staff Settings & Password
router.get("/profile", protect, async (req, res) => {
  try {
    const staff = await User.findById(req.user.id || req.user._id).select("-password");
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const staff = await User.findById(req.user.id || req.user._id);

    if (staff) {
      staff.name = name || staff.name;
      staff.email = email || staff.email;
      staff.phone = phone || staff.phone;

      const updatedStaff = await staff.save();
      res.json({ message: "Profile updated successfully!", staff: updatedStaff });
    } else {
      res.status(404).json({ message: "Staff not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const staff = await User.findById(req.user.id || req.user._id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    staff.password = await bcrypt.hash(newPassword, salt);

    await staff.save();
    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;