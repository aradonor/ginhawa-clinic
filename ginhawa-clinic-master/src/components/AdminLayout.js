import React from "react";
import DashboardShell from "./DashboardShell";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "home" },
  { to: "/admin/users", label: "User Management", icon: "users" },
  { to: "/admin/inventory", label: "Inventory & Supplies", icon: "pill" },
  { to: "/admin/reports", label: "Reports & Analytics", icon: "chart" },
  { to: "/admin/logs", label: "Audit Log", icon: "shield" },
  { to: "/admin/settings", label: "Settings", icon: "settings" },
];

export default function AdminLayout() {
  return <DashboardShell role="admin" portalName="Admin Portal" links={LINKS} />;
}