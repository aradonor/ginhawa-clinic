import React from "react";
import DashboardShell from "./DashboardShell";

const LINKS = [
  { to: "/doctor/dashboard", label: "Dashboard", icon: "home" },
  { to: "/doctor/appointments", label: "Patient Appointments", icon: "calendar" },
  { to: "/doctor/records", label: "Add Medical Record", icon: "file" },
  { to: "/doctor/prescriptions", label: "Issue Prescription", icon: "pill" },
  { to: "/doctor/settings", label: "Settings", icon: "settings" },
];

export default function DoctorLayout() {
  return <DashboardShell role="doctor" portalName="Doctor Portal" links={LINKS} />;
}