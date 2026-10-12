const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Invoice = require("../models/Billing");
const Inventory = require("../models/Inventory");
const AuditLog = require("../models/AuditLog");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeDoctors = await User.countDocuments({ role: "doctor" });
    const clinicStaff = await User.countDocuments({ role: "staff" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalUsers,
      activeDoctors,
      clinicStaff,
      totalAppointments,
    });
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats", error);
    res.status(500).json({ message: "Failed to fetch admin dashboard stats", error: error.message });
  }
});

// 2. User Management: Get All Active Users (Read)
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({ isActive: { $ne: false } }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 1. User Management: Create User
router.post("/users", protect, admin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ name, email, password, role });

    // Create Audit Log
    await AuditLog.create({
      user: req.user._id || req.user.id,
      action: "CREATE_USER",
      details: `Created new user account: ${newUser.email} (${newUser.role})`,
    });

    res.status(201).json({ 
      message: "User created successfully", 
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. User Management: Update User Details (Edit & Update)
router.put("/users/:id", protect, admin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    // Create Audit Log
    await AuditLog.create({
      user: req.user._id || req.user.id,
      action: "UPDATE_USER",
      details: `Updated details for user: ${updatedUser.email}`,
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. User Management: Update User Role
router.put("/users/:id/role", protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create Audit Log
    await AuditLog.create({
      user: req.user._id || req.user.id,
      action: "UPDATE_ROLE",
      details: `Changed role for ${user.email} to ${role}`,
    });

    res.json({ message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. User Management: Soft-Delete / Archive User
router.delete("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create Audit Log
    await AuditLog.create({
      user: req.user._id || req.user.id,
      action: "ARCHIVE_USER",
      details: `Archived user account: ${user.email}`,
    });

    res.json({ message: "User archived successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Reports & Analytics
router.get("/reports", protect, admin, async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient", isActive: { $ne: false } });
    const walkInPatients = await User.countDocuments({ role: "patient", isWalkIn: true, isActive: { $ne: false } });
    const regularPatients = totalPatients - walkInPatients;

    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: "Completed" });

    const paidInvoices = await Invoice.find({ status: "Paid" });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const unpaidInvoicesCount = await Invoice.countDocuments({ status: "Unpaid" });

    res.json({
      patientMetrics: { totalPatients, walkInPatients, regularPatients },
      appointmentMetrics: { totalAppointments, completedAppointments },
      financialMetrics: { totalRevenue, paidInvoicesCount: paidInvoices.length, unpaidInvoicesCount }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Inventory
router.get("/inventory", protect, admin, async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Inventory Item
router.post("/inventory", protect, admin, async (req, res) => {
  try {
    const { itemName, category, stockQuantity, unit, reorderLevel } = req.body;
    const newItem = await Inventory.create({ itemName, category, stockQuantity, unit, reorderLevel });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Audit Logs
router.get("/audit-logs", protect, admin, async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("user", "name email role").sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Admin Profile
router.get("/profile", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Admin Profile
router.put("/profile", protect, admin, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change Password
router.put("/change-password", protect, admin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If you have a matchPassword method on your User model:
    const isMatch = await user.matchPassword ? await user.matchPassword(currentPassword) : (user.password === currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;