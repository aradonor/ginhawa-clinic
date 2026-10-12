import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DoctorLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Ginhawa Doctor Portal</h2>
      <nav>
        <Link to="/doctor/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>
        <Link to="/doctor/appointments" style={{ marginRight: "15px" }}>Patient Appointments</Link>
        <Link to="/doctor/records" style={{ marginRight: "15px" }}>Add Medical Record</Link>
        <Link to="/doctor/prescriptions" style={{ marginRight: "15px" }}>Issue Prescription</Link>
        <Link to="/doctor/settings">Settings</Link>
        <button onClick={handleLogout} style={{ marginLeft: "20px" }}>Logout</button>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}