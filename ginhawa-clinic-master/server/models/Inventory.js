const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    stock: { type: Number, required: true, default: 50 },
    unitPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);