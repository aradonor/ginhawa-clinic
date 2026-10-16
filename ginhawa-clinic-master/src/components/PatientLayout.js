import React from "react";
import DashboardShell from "./DashboardShell";

const LINKS = [
  { to: "/patient/dashboard", label: "Dashboard", icon: "home" },
  { to: "/patient/book-appointment", label: "Book Appointment", icon: "calendar" },
  { to: "/patient/appointments", label: "My Appointments", icon: "clock" },
  { to: "/patient/records", label: "My Health Records", icon: "file" },
  { to: "/patient/prescriptions", label: "My Prescriptions", icon: "pill" },
  { to: "/patient/billing", label: "Billing", icon: "receipt" },
  { to: "/patient/settings", label: "Settings", icon: "settings" },
];

export default function PatientLayout() {
  return <DashboardShell role="patient" portalName="Patient Portal" links={LINKS} />;
}