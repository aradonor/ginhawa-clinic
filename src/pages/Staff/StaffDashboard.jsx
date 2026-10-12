import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    activeQueue: 0,
    walkInsRegistered: 0,
    todaysRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/staff/dashboard");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch staff dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Staff Operations Dashboard</h2>
      <p>Welcome back! Here is an overview of today's clinic operations.</p>

      {/* Stat Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", margin: "25px 0" }}>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Today's Appointments</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#007bff", marginTop: "10px" }}>
            {stats.todayAppointments}
          </p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Active Queue</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#ffc107", marginTop: "10px" }}>
            {stats.activeQueue}
          </p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Walk-ins Registered</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#17a2b8", marginTop: "10px" }}>
            {stats.walkInsRegistered}
          </p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Today's Revenue</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#28a745", marginTop: "10px" }}>
            ₱{stats.todaysRevenue}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "35px" }}>
        <h3>Quick Actions</h3>
        <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/staff/walk-in">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>Register Walk-in Patient</button>
          </Link>
          <Link to="/staff/queue">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>Manage Live Queue & Triage</button>
          </Link>
          <Link to="/staff/appointments">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>View Appointments</button>
          </Link>
          <Link to="/staff/billing">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>Process Billing / Payments</button>
          </Link>
        </div>
      </div>
    </div>
  );
}