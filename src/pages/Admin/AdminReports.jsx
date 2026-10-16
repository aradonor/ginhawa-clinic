import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import { peso } from "../../utils/format";

export default function AdminReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/admin/reports");
        setReportData(res.data);
      } catch (err) {
        setError("Failed to load clinic reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <Loading text="Generating clinic analytics..." />;

  const { patientMetrics, appointmentMetrics, financialMetrics } = reportData || {};

  return (
    <div className="pt">
      {/* --- INLINE PRINT STYLES --- */}
      <style>{`
        @media print {
          aside, nav, header, .sidebar, button, .no-print {
            display: none !important;
          }
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .pt {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .ui-card, .pt-stat, .pt-invoice {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 1px solid #e5e7eb !important;
            box-shadow: none !important;
            background-color: #ffffff !important;
            margin-bottom: 20px !important;
          }
          @page {
            size: portrait;
            margin: 15mm;
          }
        }
      `}</style>
      {/* --------------------------- */}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <p className="pt-lead" style={{ margin: 0 }}>Review clinic financial metrics, patient volume, and appointment history.</p>
        
        <button onClick={() => window.print()} className="ui-btn ui-btn--ghost ui-btn--sm">
          <Icon name="receipt" size={16} /> Print / Export Report
        </button>
      </div>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {/* Financial Overview Card */}
      <div className="ui-card pt-invoice" style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <span className="pt-stat__icon pt-stat__icon--green" style={{ marginBottom: 0 }}>
            <Icon name="receipt" size={20} />
          </span>
          <h2 className="pt-section-title" style={{ margin: 0 }}>Financial Overview</h2>
        </div>

        {/* --- SPACED OUT FINANCIAL LINES --- */}
        <ul className="pt-lines" style={{ padding: 0, margin: 0, listStyle: "none" }}>
          <li style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "var(--gh-muted)" }}>Total Revenue Collected</span>
            <strong>{peso(financialMetrics?.totalRevenue || 0)}</strong>
          </li>
          <li style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "var(--gh-muted)" }}>Paid Invoices</span>
            <span>{financialMetrics?.paidInvoicesCount || 0} invoices</span>
          </li>
          <li style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--gh-muted)" }}>Pending / Unpaid Invoices</span>
            <span style={{ color: "var(--gh-amber)", fontWeight: "600" }}>
              {financialMetrics?.unpaidInvoicesCount || 0} unpaid
            </span>
          </li>
        </ul>
        {/* --------------------------------- */}
      </div>

      {/* Analytics Grid */}
      <div className="pt-stats">
        {/* Patient Volume Card */}
        <div className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--blue">
            <Icon name="users" size={22} />
          </span>
          <span className="pt-stat__label">Total Registered Patients</span>
          <span className="pt-stat__value">{patientMetrics?.totalPatients || 0}</span>
          <div style={{ fontSize: "0.85rem", color: "var(--gh-muted)", marginTop: "0.4rem" }}>
            <div>Walk-in Patients: <strong>{patientMetrics?.walkInPatients || 0}</strong></div>
            <div>Scheduled Regulars: <strong>{patientMetrics?.regularPatients || 0}</strong></div>
          </div>
        </div>

        {/* Appointment Activity Card */}
        <div className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--amber">
            <Icon name="calendar" size={22} />
          </span>
          <span className="pt-stat__label">Total Appointments</span>
          <span className="pt-stat__value">{appointmentMetrics?.totalAppointments || 0}</span>
          <div style={{ fontSize: "0.85rem", color: "var(--gh-muted)", marginTop: "0.4rem" }}>
            <div>Completed Visits: <strong>{appointmentMetrics?.completedAppointments || 0}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}