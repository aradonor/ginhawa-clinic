import React, { useState, useEffect } from "react";
import API from "../../api/axios";

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

  if (loading) return <div>Generating clinic reports...</div>;
  if (error) return <div style={{ color: "red", padding: "20px" }}>{error}</div>;

  const { patientMetrics, appointmentMetrics, financialMetrics } = reportData || {};

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Clinic Analytics & Financial Reports</h2>

      {/* Financial Summary */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Financial Overview</h3>
        <p>Total Revenue Collected: ₱{financialMetrics?.totalRevenue?.toLocaleString() || 0}</p>
        <p>Paid Invoices: {financialMetrics?.paidInvoicesCount || 0}</p>
        <p>Pending / Unpaid Invoices: {financialMetrics?.unpaidInvoicesCount || 0}</p>
      </div>

      {/* Patient Volume */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Patient Volume</h3>
        <p>Total Registered Patients: {patientMetrics?.totalPatients || 0}</p>
        <p>Walk-in Patients: {patientMetrics?.walkInPatients || 0}</p>
        <p>Scheduled / Regular Patients: {patientMetrics?.regularPatients || 0}</p>
      </div>

      {/* Appointments Activity */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Appointment Activity</h3>
        <p>Total Appointments Booked: {appointmentMetrics?.totalAppointments || 0}</p>
        <p>Completed Appointments: {appointmentMetrics?.completedAppointments || 0}</p>
      </div>

      <button onClick={() => window.print()} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Print / Export Summary Report
      </button>
    </div>
  );
}