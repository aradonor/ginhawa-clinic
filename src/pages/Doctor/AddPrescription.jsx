import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function AddPrescription() {
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    medication: "",
    quantity: 1,
    dosage: "",
    instructions: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, invRes] = await Promise.all([
          API.get("/doctor/appointments"),
          API.get("/inventory")
        ]);
        setAppointments(appRes.data);
        setInventory(invRes.data);
      } catch (err) {
        setError("Failed to load component data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.post("/doctor/prescriptions", formData);
      setSuccess("Prescription issued, inventory deducted, and billing updated!");
      setFormData({
        patientId: "",
        medication: "",
        quantity: 1,
        dosage: "",
        instructions: "",
      });
      
      const updatedInv = await API.get("/inventory");
      setInventory(updatedInv.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save prescription");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading prescription module...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div>
        <h2>Issue Prescription</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Select Booked Patient:</label><br />
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Choose Patient</option>
              {appointments.map((app) => {
                const patientObj = typeof app.patient === "object" ? app.patient : null;
                const pName = patientObj?.name || app.patientName || "Patient";
                const pId = patientObj?._id || app.patient || app.patientId;
                return (
                  <option key={app._id} value={pId}>
                    {pName} ({app.date || "Scheduled"} - {app.time || "Appointment"})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label>Select Medicine from Inventory:</label><br />
            <select
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              required
            >
              <option value="">Choose Medicine</option>
              {inventory.map((item) => {
                const name = item.itemName || item.name;
                const stock = item.stockQuantity !== undefined ? item.stockQuantity : item.stock;
                const price = item.unitPrice || 0;
                
                return (
                  <option key={item._id} value={name} disabled={stock <= 0}>
                    {name} (Stock: {stock}) - ₱{price.toFixed(2)}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label>Quantity:</label><br />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div>
            <label>Dosage:</label><br />
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g. 500mg, 1 tablet twice a day"
              required
            />
          </div>

          <div>
            <label>Instructions:</label><br />
            <input
              type="text"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g. Take after meals"
              required
            />
          </div>
          <br />
          <button type="submit">Submit Prescription & Bill Patient</button>
        </form>
      </div>
    </div>
  );
}