import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import { peso, formatDate } from "../../utils/format";

const statusOf = (inv) => inv.status || inv.paymentStatus || "Unpaid";
const totalOf = (inv) => inv.totalAmount || inv.amount || 0;

export default function Billing() {
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const response = await API.get("/patient/billing");
        setBilling(response.data);
      } catch (err) {
        setError("Failed to load billing records");
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  if (loading) return <Loading text="Loading your billing…" />;

  const unpaid = billing.filter((b) => statusOf(b) === "Unpaid").reduce((sum, b) => sum + totalOf(b), 0);
  const paid = billing.filter((b) => statusOf(b) === "Paid").reduce((sum, b) => sum + totalOf(b), 0);

  return (
    <div className="pt">
      <p className="pt-lead">Your charges and payments from the clinic.</p>
      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {billing.length === 0 ? (
        <EmptyState
          icon="receipt"
          title="No bills yet"
          text="Charges from your visits will appear here after your consultation."
        />
      ) : (
        <>
          <div className="pt-stats">
            <div className="ui-card pt-stat">
              <span className="pt-stat__icon pt-stat__icon--red"><Icon name="receipt" /></span>
              <span className="pt-stat__label">Unpaid balance</span>
              <span className="pt-stat__value">{peso(unpaid)}</span>
              <span className="pt-stat__hint">{unpaid > 0 ? "Please settle at the clinic" : "You are all settled"}</span>
            </div>
            <div className="ui-card pt-stat">
              <span className="pt-stat__icon pt-stat__icon--green"><Icon name="check" /></span>
              <span className="pt-stat__label">Total paid</span>
              <span className="pt-stat__value">{peso(paid)}</span>
              <span className="pt-stat__hint">Thank you</span>
            </div>
          </div>

          <ul className="pt-list">
            {billing.map((inv) => {
              const hasItems = inv.items && Array.isArray(inv.items) && inv.items.length > 0;
              const date = inv.date || inv.createdAt?.split("T")[0] || "";
              // Legacy records have a single description instead of line items
              const lines = hasItems
                ? inv.items.map((item) => ({ text: item.description, amount: item.amount }))
                : [{ text: inv.description || "Checkup / Consultation", amount: totalOf(inv) }];

              return (
                <li key={inv._id || inv.id} className="ui-card pt-invoice">
                  <div className="pt-record__head">
                    <div>
                      <h2 className="pt-record__title">Invoice</h2>
                      <p className="pt-record__meta">
                        <span><Icon name="calendar" size={15} />{date ? formatDate(date) : "N/A"}</span>
                      </p>
                    </div>
                    <Badge status={statusOf(inv)} />
                  </div>
                  <ul className="pt-lines">
                    {lines.map((line, i) => (
                      <li key={i}><span>{line.text}</span><span>{peso(line.amount)}</span></li>
                    ))}
                  </ul>
                  <div className="pt-invoice__total">
                    <span>Total</span>
                    <strong>{peso(totalOf(inv))}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
