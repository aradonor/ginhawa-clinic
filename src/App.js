import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import PatientLayout from "./components/PatientLayout";
import Dashboard from "./pages/Patients/Dashboard";
import BookAppointment from "./pages/Patients/BookAppointment";
import MyAppointments from "./pages/Patients/MyAppointments";
import MyHealthRecords from "./pages/Patients/MyHealthRecords";
import MyPrescriptions from "./pages/Patients/MyPrescriptions";
import Billing from "./pages/Patients/Billing";
import PatientSettings from "./pages/Patients/PatientSettings"; 

import DoctorLayout from "./components/DoctorLayout";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import AddRecord from "./pages/Doctor/AddRecord";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import AddPrescription from "./pages/Doctor/AddPrescription";
import DoctorSettings from "./pages/Doctor/DoctorSettings"; 

import StaffLayout from "./components/StaffLayout";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import AppointmentManager from "./pages/Staff/AppointmentManager";
import WalkInRegistration from "./pages/Staff/WalkInRegistration";
import LiveQueueTriage from "./pages/Staff/LiveQueueTriage";
import PatientDatabase from "./pages/Staff/PatientDatabase";
import StaffSettings from "./pages/Staff/StaffSettings"
import StaffBilling from "./pages/Staff/StaffBilling";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminReports from "./pages/Admin/AdminReports"
import AuditLogs from "./pages/Admin/AuditLogs"
import InventoryManagement from "./pages/Admin/InventoryManagement"
import UserManagement from "./pages/Admin/UserManagement"
import AdminSettings from "./pages/Admin/AdminSettings"

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/patient" element={<PatientLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="records" element={<MyHealthRecords />} />
            <Route path="prescriptions" element={<MyPrescriptions />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<PatientSettings />} />
          </Route>
          
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="records" element={<AddRecord />} />
            <Route path="prescriptions" element={<AddPrescription />} />
            <Route path="settings" element={<DoctorSettings />} />
          </Route>

          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="appointments" element={<AppointmentManager />} />
            <Route path="walkin" element={<WalkInRegistration />} />
            <Route path="queue" element={<LiveQueueTriage />} />
            <Route path="patients" element={<PatientDatabase />} />
            <Route path="billing" element={<StaffBilling />} />
            <Route path="settings" element={<StaffSettings />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="logs" element={<AuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
           </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}