import React from "react";
import DashboardShell from "./DashboardShell";

const LINKS = [
  { to: "/staff/dashboard", label: "Dashboard", icon: "home" },
  { to: "/staff/appointments", label: "Appointment Manager", icon: "calendar" },
  { to: "/staff/walkin", label: "Walk-ins & Registration", icon: "userPlus" },
  { to: "/staff/queue", label: "Live Queue & Triage", icon: "clock" },
  { to: "/staff/patients", label: "Patient Database", icon: "users" },
  { to: "/staff/billing", label: "Billing & Payments", icon: "receipt" },
  { to: "/staff/settings", label: "Settings", icon: "settings" },
];

export default function StaffLayout() {
  return <DashboardShell role="staff" portalName="Staff & Reception Portal" links={LINKS} />;
}