import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import { peso } from "../../utils/format";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Medicine",
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
      const medicineOnly = res.data.filter((item) => (item.category || "Medicine") === "Medicine");
      setInventory(medicineOnly);
    } catch (err) {
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
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
        category: "Medicine",
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

  if (loading) return <Loading text="Loading pharmacy inventory…" />;

  return (
    <div className="pt">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <p className="pt-lead" style={{ margin: 0 }}>Manage pharmacy stock levels, reorder alerts, and medicine prices.</p>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else { resetForm(); setShowForm(true); }
          }}
          className="ui-btn ui-btn--primary ui-btn--sm"
        >
          <Icon name="plus" size={16} /> {showForm ? "Cancel" : "Add New Medicine"}
        </button>
      </div>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}
      {success && <p className="ui-alert ui-alert--success" role="status">{success}</p>}

      {/* Add / Edit Form Card */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="ui-card ui-stack">
          <h3 className="pt-section-title" style={{ margin: 0 }}>
            {editingId ? "Edit Medicine Record" : "Add New Medicine to Stock"}
          </h3>

          <div className="ui-field">
            <label htmlFor="itemName">Medicine Name</label>
            <input
              id="itemName"
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g. Paracetamol 500mg"
              required
            />
          </div>

          <div className="pt-two">
            <div className="ui-field">
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <input
                id="stockQuantity"
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="e.g. 100"
                required
              />
            </div>
            <div className="ui-field">
              <label htmlFor="unit">Unit Type</label>
              <input
                id="unit"
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="pcs, tablets, boxes"
                required
              />
            </div>
          </div>

          <div className="pt-two">
            <div className="ui-field">
              <label htmlFor="unitPrice">Unit Price (₱)</label>
              <input
                id="unitPrice"
                type="number"
                step="0.01"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="ui-field">
              <label htmlFor="reorderLevel">Low Stock Alert Threshold</label>
              <input
                id="reorderLevel"
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="ui-btn ui-btn--primary">
            <Icon name="check" size={16} /> {editingId ? "Update Medicine" : "Save Medicine"}
          </button>
        </form>
      )}

      {/* Inventory Table Card */}
      {inventory.length === 0 ? (
        <EmptyState
          icon="pill"
          title="No medicines found"
          text="Your pharmacy stock is currently empty. Click above to add medicines."
        />
      ) : (
        <div className="ui-card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
            <thead>
              <tr style={{ background: "var(--gh-soft)", borderBottom: "1px solid var(--gh-border)", textAlign: "left" }}>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Medicine Name</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Available Stock</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Unit Price</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const name = item.itemName || item.name;
                const stock = item.stockQuantity !== undefined ? item.stockQuantity : item.stock;
                const unit = item.unit || "pcs";
                const price = item.unitPrice || 0;
                const reorder = item.reorderLevel !== undefined ? item.reorderLevel : 10;
                const isLow = stock <= reorder;

                return (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--gh-border)" }}>
                    <td style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>{name}</td>
                    <td style={{ padding: "0.9rem 1.25rem" }}>
                      {stock} {unit}
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem", fontWeight: "500" }}>
                      {peso(price)}
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem" }}>
                      <Badge status={isLow ? "Unpaid" : "Active"} />
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEdit(item)}
                          className="ui-btn ui-btn--ghost ui-btn--sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="ui-btn ui-btn--danger ui-btn--sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}