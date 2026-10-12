import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    scheduledToday: 0,
    attendedPatients: 0,
    totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/doctor/dashboard");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch doctor dashboard stats", err);
        setError("Failed to load dashboard overview.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "850px", margin: "0 auto" }}>
      <h2>Doctor Dashboard</h2>
      <p>Welcome back! Here is an overview of your clinic schedule and patient activity.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Stat Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", margin: "25px 0" }}>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Pending Requests</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#ffc107", marginTop: "10px" }}>
            {stats.pendingRequests}
          </p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Scheduled Today</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#007bff", marginTop: "10px" }}>
            {stats.scheduledToday}
          </p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Attended Patients</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#28a745", marginTop: "10px" }}>
            {stats.attendedPatients}
          </p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div style={{ marginTop: "35px" }}>
        <h3>Quick Actions</h3>
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <Link to="/doctor/appointments">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>
              View & Manage Appointments
            </button>
          </Link>
          <Link to="/doctor/prescription">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>
              Issue Prescription & Record
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}