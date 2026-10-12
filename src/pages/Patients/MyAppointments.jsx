import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/patient/appointments");
      setAppointments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await API.put(`/patient/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel appointment");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading appointments...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div>
        <h2>My Appointments</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>
          <Link to="/patient/book-appointment">+ Book New Appointment</Link>
        </p>

        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt._id || apt.id}>
                  <td>{apt.doctorName}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>{apt.reason || "N/A"}</td>
                  <td>{apt.status || "Pending"}</td>
                  <td>
                    {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                      <button onClick={() => handleCancel(apt._id || apt.id)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}