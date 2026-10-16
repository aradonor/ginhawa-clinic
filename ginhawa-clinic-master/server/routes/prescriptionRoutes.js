router.post("/", protect, async (req, res) => {
  try {
    const { patientId, doctorId, items } = req.body; // items: [{ medicineName, quantity }]

    let totalBillAmount = 0;
    const prescriptionItems = [];

    for (const item of items) {
      // Find medicine in inventory
      const medicine = await Inventory.findOne({ name: item.medicineName });
      if (!medicine) {
        return res.status(404).json({ message: `Medicine ${item.medicineName} not found in inventory.` });
      }

      if (medicine.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${medicine.name}. Remaining: ${medicine.stock}` });
      }

      // Deduct stock
      medicine.stock -= item.quantity;
      await medicine.save();

      // Calculate cost
      const itemTotal = medicine.unitPrice * item.quantity;
      totalBillAmount += itemTotal;

      prescriptionItems.push({
        medicineName: medicine.name,
        quantity: item.quantity,
        price: medicine.unitPrice,
        total: itemTotal
      });
    }

    // Save Prescription
    const newPrescription = await Prescription.create({
      patient: patientId,
      doctor: doctorId,
      items: prescriptionItems
    });

    // Automatically create or append to Patient Billing Invoice
    await Invoice.create({
      patient: patientId,
      items: prescriptionItems,
      totalAmount: totalBillAmount,
      status: "Unpaid"
    });

    res.status(201).json({ message: "Prescription issued, inventory updated, and billing generated successfully!", newPrescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});