import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function StaffBilling() {
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBilling = async () => {
    try {
      const res = await API.get("/staff/billing");
      setBilling(res.data);
    } catch (err) {
      setError("Failed to load billing records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleMarkAsPaid = async (id) => {
    try {
      await API.put(`/staff/billing/${id}/pay`);
      fetchBilling();
    } catch (err) {
      alert("Failed to process payment.");
    }
  };

  if (loading) return <div>Loading billing records...</div>;

  return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
      <h2>Billing & Payments Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Billing ID</th>
            <th>Patient Name</th>
            <th>Items / Charges</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {billing.map((inv) => (
            <tr key={inv._id}>
              <td>{inv._id.slice(-6).toUpperCase()}</td>
              <td>{inv.patient?.name || "Walk-in Patient"}</td>
              <td>
                {inv.items?.map((item, idx) => (
                  <div key={idx}>{item.description} - ₱{item.amount}</div>
                ))}
              </td>
              <td>₱{inv.totalAmount}</td>
              <td>{inv.status}</td>
              <td>
                {inv.status !== "Paid" && (
                  <button onClick={() => handleMarkAsPaid(inv._id)}>
                    Mark as Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
          {billing.length === 0 && (
            <tr>
              <td colSpan="6">No billing found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}