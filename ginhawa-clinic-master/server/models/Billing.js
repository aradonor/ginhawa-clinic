const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ description: String, amount: Number }],
  totalAmount: Number,
  paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("Billing", billingSchema);