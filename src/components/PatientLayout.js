import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PatientLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Ginhawa Patient Portal</h2>
      <nav>
        <Link to="/patient/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>
        <Link to="/patient/book-appointment" style={{ marginRight: "15px" }}>Book Appointment</Link>
        <Link to="/patient/appointments" style={{ marginRight: "15px" }}>My Appointments</Link>
        <Link to="/patient/records" style={{ marginRight: "15px" }}>My Health Records</Link>
        <Link to="/patient/prescriptions" style={{ marginRight: "15px" }}>My Prescriptions</Link>
        <Link to="/patient/billing" style={{ marginRight: "15px" }}>Billing</Link>
        <Link to="/patient/settings" style={{ marginRight: "15px" }}>Settings</Link>
        <button onClick={handleLogout} style={{ marginLeft: "20px" }}>Logout</button>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}