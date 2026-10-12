const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const { protect } = require("../middleware/authMiddleware");

// GET all inventory items
router.get("/", protect, async (req, res) => {
  try {
    const items = await Inventory.find({}).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD a new inventory medicine (Create)
router.post("/", protect, async (req, res) => {
  try {
    const { name, stock, unitPrice } = req.body;
    const newItem = await Inventory.create({
      name,
      stock: stock !== undefined ? stock : 50,
      unitPrice: unitPrice || 0
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE an inventory item stock or price (Update)
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ message: "Medicine not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE an inventory item (Delete)
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine removed from inventory successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/seed", async (req, res) => {
  try {
    const medicines25 = [
      { itemName: "Paracetamol 500mg", category: "Medicine", stockQuantity: 50, unit: "pcs", unitPrice: 5.00, reorderLevel: 10 },
      { itemName: "Ibuprofen 400mg", category: "Medicine", stockQuantity: 50, unit: "pcs", unitPrice: 8.00, reorderLevel: 10 },
      { itemName: "Mefenamic Acid 500mg", category: "Medicine", stockQuantity: 50, unit: "pcs", unitPrice: 10.00, reorderLevel: 10 },
      { itemName: "Amoxicillin 500mg", category: "Medicine", stockQuantity: 50, unit: "capsules", unitPrice: 12.00, reorderLevel: 10 },
      { itemName: "Cephalexin 500mg", category: "Medicine", stockQuantity: 50, unit: "capsules", unitPrice: 15.00, reorderLevel: 10 },
      { itemName: "Ciprofloxacin 500mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 18.00, reorderLevel: 10 },
      { itemName: "Azithromycin 500mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 35.00, reorderLevel: 10 },
      { itemName: "Cetirizine 10mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 6.00, reorderLevel: 10 },
      { itemName: "Loratadine 10mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 8.00, reorderLevel: 10 },
      { itemName: "Phenylephrine / Chlorphenamine (Neozep)", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 7.00, reorderLevel: 10 },
      { itemName: "Carbocisteine 500mg", category: "Medicine", stockQuantity: 50, unit: "capsules", unitPrice: 9.00, reorderLevel: 10 },
      { itemName: "Erdosteine 300mg", category: "Medicine", stockQuantity: 50, unit: "capsules", unitPrice: 22.00, reorderLevel: 10 },
      { itemName: "Lagundi 600mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 7.00, reorderLevel: 10 },
      { itemName: "Omeprazole 20mg", category: "Medicine", stockQuantity: 50, unit: "capsules", unitPrice: 14.00, reorderLevel: 10 },
      { itemName: "Antacid Tablet (Kremil-S)", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 8.00, reorderLevel: 10 },
      { itemName: "Hyoscine N-butylbromide (Buscopan)", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 16.00, reorderLevel: 10 },
      { itemName: "Metformin 500mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 6.00, reorderLevel: 10 },
      { itemName: "Losartan 50mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 9.00, reorderLevel: 10 },
      { itemName: "Amlodipine 5mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 8.00, reorderLevel: 10 },
      { itemName: "Simvastatin 20mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 11.00, reorderLevel: 10 },
      { itemName: "Salbutamol Inhaler", category: "Medicine", stockQuantity: 50, unit: "pcs", unitPrice: 180.00, reorderLevel: 10 },
      { itemName: "Prednisone 10mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 10.00, reorderLevel: 10 },
      { itemName: "Vitamin C 500mg", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 4.00, reorderLevel: 10 },
      { itemName: "Vitamin B-Complex", category: "Medicine", stockQuantity: 50, unit: "tablets", unitPrice: 5.00, reorderLevel: 10 },
      { itemName: "Oral Rehydration Salts (ORS)", category: "Medicine", stockQuantity: 50, unit: "sachets", unitPrice: 12.00, reorderLevel: 10 }
    ];

    for (const med of medicines25) {
      await Inventory.findOneAndUpdate(
        { itemName: med.itemName },
        med,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Successfully seeded 25 checkup medicines!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;