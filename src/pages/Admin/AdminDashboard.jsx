import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    clinicStaff: 0,
    totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/admin/dashboard");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch admin dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Clinic Administrator Portal</h2>
      <p>Welcome back! Here is a high-level system overview.</p>

      {/* Stat Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", margin: "25px 0" }}>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Total Users</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#333", marginTop: "10px" }}>
            {stats.totalUsers}
          </p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Active Doctors</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#007bff", marginTop: "10px" }}>
            {stats.activeDoctors}
          </p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Clinic Staff</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#17a2b8", marginTop: "10px" }}>
            {stats.clinicStaff}
          </p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>Total Appointments</h4>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#28a745", marginTop: "10px" }}>
            {stats.totalAppointments}
          </p>
        </div>
      </div>

      {/* Quick Management Links */}
      <div style={{ marginTop: "35px" }}>
        <h3>Quick Management Links</h3>
        <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/admin/users">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>Manage Users & Roles</button>
          </Link>
          <Link to="/admin/inventory">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>Inventory & Supplies</button>
          </Link>
          <Link to="/admin/reports">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>Reports & Analytics</button>
          </Link>
          <Link to="/admin/audit-logs">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>System Audit Logs</button>
          </Link>
          <Link to="/admin/configuration">
            <button style={{ padding: "10px 15px", cursor: "pointer" }}>Clinic Configuration</button>
          </Link>
        </div>
      </div>
    </div>
  );
}