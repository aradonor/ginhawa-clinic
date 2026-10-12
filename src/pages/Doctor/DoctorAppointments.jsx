import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/doctor/appointments");
        setAppointments(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading appointments...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column" }}>
      <div style={{ width: "80%", maxWidth: "800px" }}>
        <h2>Doctor Schedule & Appointments</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {appointments.length === 0 ? (
          <p>No appointments scheduled.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "20px", width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => {
                const patientObj = typeof app.patient === "object" ? app.patient : null;
                return (
                  <tr key={app._id}>
                    <td>{patientObj?.name || app.patientName || "N/A"}</td>
                    <td>{patientObj?.email || app.patientEmail || "N/A"}</td>
                    <td>{app.date}</td>
                    <td>{app.time}</td>
                    <td>{app.status || "Pending"}</td>
                    <td>{app.reason || "General Checkup"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}   