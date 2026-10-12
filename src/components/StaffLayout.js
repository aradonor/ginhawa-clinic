import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StaffLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav>
        <h2>Ginhawa Staff & Reception Portal</h2>
        <div>
        <Link to="/staff/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>
        <Link to="/staff/appointments" style={{ marginRight: "15px" }}>Appointment Manager</Link>
        <Link to="/staff/walkin" style={{ marginRight: "15px" }}>Walk-ins & Registration</Link>
        <Link to="/staff/queue" style={{ marginRight: "15px" }}>Live Queue & Triage</Link>
        <Link to="/staff/patients" style={{ marginRight: "15px" }}>Patient Database</Link>
        <Link to="/staff/billing" style={{ marginRight: "15px" }}>Billing & Payments</Link> 
        <Link to="/staff/settings" style={{ marginRight: "15px" }}>Settings</Link>
          <button onClick={handleLogout}style={{ marginLeft: "20px" }}>Logout</button>
        </div>
        <hr/>
      </nav>
        <Outlet />
    </div>
  );
}