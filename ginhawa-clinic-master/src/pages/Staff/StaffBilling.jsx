import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Loading from "../../components/ui/Loading";
import { peso } from "../../utils/format";

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

  if (loading) return <Loading text="Loading clinic billing statements…" />;

  return (
    <div className="pt">
      <p className="pt-lead">Review outpatient charges, prescribed medication totals, and mark bills as paid upon settlement.</p>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {billing.length === 0 ? (
        <EmptyState
          icon="receipt"
          title="No billing records"
          text="No billing invoices have been issued yet."
        />
      ) : (
        <div className="ui-table-card">
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th style={{ width: "12%" }}>Invoice ID</th>
                  <th style={{ width: "20%" }}>Patient Name</th>
                  <th style={{ width: "34%" }}>Items & Charges</th>
                  <th style={{ width: "12%" }}>Total Amount</th>
                  <th style={{ width: "10%" }}>Status</th>
                  <th style={{ width: "12%", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {billing.map((inv) => (
                  <tr key={inv._id}>
                    <td style={{ fontWeight: "600", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                      #{inv._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ fontWeight: "600", whiteSpace: "nowrap" }}>
                      {inv.patient?.name || "Walk-in Patient"}
                    </td>
                    <td style={{ color: "var(--gh-muted)", fontSize: "0.85rem", maxWidth: "280px" }}>
                      {inv.items?.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: "0.25rem", display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                          <span>{item.description}</span>
                          <strong style={{ color: "var(--gh-ink)", whiteSpace: "nowrap" }}>{peso(item.amount)}</strong>
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: "700", fontSize: "1rem", whiteSpace: "nowrap" }}>
                      {peso(inv.totalAmount || 0)}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Badge status={inv.status || "Unpaid"} />
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {inv.status !== "Paid" && (
                        <button
                          onClick={() => handleMarkAsPaid(inv._id)}
                          className="ui-btn ui-btn--primary ui-btn--sm"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}