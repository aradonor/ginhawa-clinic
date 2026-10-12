import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function PatientDashboard() {
  const [stats, setStats] = useState({
    upcomingAppointment: null,
    activePrescriptionsCount: 0,
    unpaidBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch appointments, prescriptions, and billing to calculate summary cards
        const [appRes, prescRes, billRes] = await Promise.all([
          API.get("/patient/appointments").catch(() => ({ data: [] })),
          API.get("/patient/prescriptions").catch(() => ({ data: [] })),
          API.get("/patient/billing").catch(() => ({ data: [] })),
        ]);

        // Find next upcoming appointment
        const upcoming = appRes.data.find(app => app.status === "Pending" || app.status === "Scheduled");

        // Count active prescriptions
        const activePresc = prescRes.data.filter(p => p.status === "Active").length;

        // Calculate total unpaid bills
        const unpaidTotal = billRes.data
          .filter(b => (b.status || b.paymentStatus) === "Unpaid")
          .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);

        setStats({
          upcomingAppointment: upcoming ? `${upcoming.date} at ${upcoming.time}` : "None scheduled",
          activePrescriptionsCount: activePresc,
          unpaidBalance: unpaidTotal,
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Patient Dashboard</h2>
      <p>Welcome back! Here is a summary of your recent clinic activity.</p>

      {/* Stat Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", margin: "20px 0" }}>
        <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Next Appointment</h4>
          <p style={{ fontWeight: "bold", color: "#333" }}>{stats.upcomingAppointment}</p>
        </div>
        <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Active Prescriptions</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#007bff" }}>{stats.activePrescriptionsCount}</p>
        </div>
        <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Unpaid Balance</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#dc3545" }}>₱{stats.unpaidBalance}</p>
        </div>
      </div>

      {/* Quick Action Links */}
      <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
        <Link to="/patient/book-appointment">
          <button style={{ padding: "10px 15px", cursor: "pointer" }}>Book New Appointment</button>
        </Link>
        <Link to="/patient/billing">
          <button style={{ padding: "10px 15px", cursor: "pointer" }}>View Billing Details</button>
        </Link>
      </div>
    </div>
  );
}