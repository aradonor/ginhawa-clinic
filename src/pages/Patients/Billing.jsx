import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Billing() {
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        console.log("Frontend attempting to fetch: /patient/billing");
        const response = await API.get("/patient/billing");
        console.log("Frontend billing response data:", response.data);
        setBilling(response.data);
      } catch (err) {
        console.error("Frontend billing fetch error:", err.response || err);
        setError("Failed to load billing records");
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading billing records...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div>
        <h2>Billing</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {billing.length === 0 ? (
          <p>No billing found.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {billing.map((inv) => {
                const hasItems = inv.items && Array.isArray(inv.items) && inv.items.length > 0;
                const grandTotal = inv.totalAmount || inv.amount || 0;

                if (hasItems) {
                  return (
                    <React.Fragment key={inv._id || inv.id}>
                      {inv.items.map((item, index) => (
                        <tr key={`${inv._id || inv.id}-${index}`}>
                          <td>{index === 0 ? (inv.date || inv.createdAt?.split("T")[0] || "N/A") : ""}</td>
                          <td>{item.description}</td>
                          <td>₱{item.amount}</td>
                          {/* Leave status blank on item rows so it only shows on the total row */}
                          <td></td>
                        </tr>
                      ))}
                      {/* Total Row with Status moved here */}
                      <tr style={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}>
                        <td></td>
                        <td style={{ textAlign: "right" }}>Total:</td>
                        <td>₱{grandTotal}</td>
                        <td>{inv.status || inv.paymentStatus || "Unpaid"}</td>
                      </tr>
                    </React.Fragment>
                  );
                }

                // Fallback for legacy single-line records
                const displayDesc = inv.description || "Checkup / Consultation";
                
                return (
                  <React.Fragment key={inv._id || inv.id}>
                    <tr>
                      <td>{inv.date || inv.createdAt?.split("T")[0] || "N/A"}</td>
                      <td>{displayDesc}</td>
                      <td>₱{grandTotal}</td>
                      <td>{inv.status || inv.paymentStatus || "Unpaid"}</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}