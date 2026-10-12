import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav>
        <h2>Ginhawa Admin</h2>
        <div>
          <Link to="/admin/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>
          <Link to="/admin/users" style={{ marginRight: "15px" }}>User Management</Link>
          <Link to="/admin/inventory" style={{ marginRight: "15px" }}>Inventory & Supplies</Link>
          <Link to="/admin/reports" style={{ marginRight: "15px" }}>Reports & Analytics</Link>
          <Link to="/admin/logs" style={{ marginRight: "15px" }}>Audit Log</Link>
          <Link to="/admin/settings" style={{ marginRight: "15px" }}>Settings</Link>
          <button onClick={handleLogout}style={{ marginLeft: "20px" }}>Logout</button>
        </div>
        <hr/>
      </nav>
        <Outlet />
    </div>
  );
}