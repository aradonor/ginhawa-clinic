import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Medicine", // Hardcoded to Medicine
    stockQuantity: "",
    unit: "pcs",
    unitPrice: "",
    reorderLevel: 10,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory");
      // Optional: Filter to ensure only medicines show up on the UI
      const medicineOnly = res.data.filter(item => (item.category || "Medicine") === "Medicine");
      setInventory(medicineOnly);
    } catch (err) {
      setError("Failed to load inventory.");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        category: "Medicine", // Ensure category is strictly Medicine
        stockQuantity: Number(formData.stockQuantity),
        unitPrice: Number(formData.unitPrice),
        reorderLevel: Number(formData.reorderLevel),
      };

      if (editingId) {
        await API.put(`/admin/inventory/${editingId}`, payload);
        setSuccess("Medicine updated successfully!");
      } else {
        await API.post("/admin/inventory", payload);
        setSuccess("Medicine added successfully!");
      }

      resetForm();
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save medicine.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      itemName: item.itemName || item.name || "",
      category: "Medicine",
      stockQuantity: item.stockQuantity !== undefined ? item.stockQuantity : item.stock || "",
      unit: item.unit || "pcs",
      unitPrice: item.unitPrice || "",
      reorderLevel: item.reorderLevel !== undefined ? item.reorderLevel : 10,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    
    setError("");
    setSuccess("");

    try {
      await API.delete(`/admin/inventory/${id}`);
      setSuccess("Medicine deleted successfully!");
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete medicine.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      itemName: "",
      category: "Medicine",
      stockQuantity: "",
      unit: "pcs",
      unitPrice: "",
      reorderLevel: 10,
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Clinic Medicine Inventory</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {!showForm ? (
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{ marginBottom: "20px", padding: "8px 15px", cursor: "pointer", background: "#f8f9fa", border: "1px solid #ccc", borderRadius: "4px", fontWeight: "bold" }}
        >
          + Add New Medicine
        </button>
      ) : (
        <button 
          onClick={resetForm}
          style={{ marginBottom: "20px", padding: "8px 15px", cursor: "pointer", background: "#f8f9fa", border: "1px solid #ccc", borderRadius: "4px", fontWeight: "bold" }}
        >
          Cancel
        </button>
      )}

      {showForm && (
        <form onSubmit={handleFormSubmit} style={{ background: "#fff", padding: "20px", marginBottom: "30px", borderRadius: "8px", border: "1px solid #ccc" }}>
          <h3>{editingId ? "Edit Medicine" : "Add New Medicine"}</h3>
          
          <div style={{ marginBottom: "12px" }}>
            <label>Medicine Name:</label><br />
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g. Paracetamol 500mg"
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginTop: "4px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Quantity Stock:</label><br />
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginTop: "4px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Unit (e.g. pcs, tablets, capsules, boxes):</label><br />
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginTop: "4px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Unit Price (₱):</label><br />
            <input
              type="number"
              step="0.01"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="0.00"
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginTop: "4px" }}
            />
          </div>

          <button type="submit" style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            {editingId ? "Update Medicine" : "Save Medicine"}
          </button>
        </form>
      )}

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
        <thead>
          <tr style={{ background: "#f2f2f2", textAlign: "left" }}>
            <th>Medicine Name</th>
            <th>Stock</th>
            <th>Unit Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const name = item.itemName || item.name;
            const stock = item.stockQuantity !== undefined ? item.stockQuantity : item.stock;
            const unit = item.unit || "pcs";
            const price = item.unitPrice || 0;
            const reorder = item.reorderLevel !== undefined ? item.reorderLevel : 10;

            return (
              <tr key={item._id}>
                <td>{name}</td>
                <td>{stock} {unit}</td>
                <td>₱{price.toFixed(2)}</td>
                <td>
                  {stock <= reorder ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>Low Stock</span>
                  ) : (
                    <span style={{ color: "green", fontWeight: "bold" }}>In Stock</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: "5px", padding: "5px 10px", background: "#fff", border: "1px solid #ccc", borderRadius: "3px", cursor: "pointer" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} style={{ padding: "5px 10px", background: "#fff", border: "1px solid #ccc", borderRadius: "3px", cursor: "pointer", color: "red" }}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {inventory.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No medicines found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}