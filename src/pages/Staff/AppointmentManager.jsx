import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/staff/appointments");
      setAppointments(res.data);
    } catch (err) {
      setError("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await API.put(`/staff/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      alert("Failed to update appointment status.");
    }
  };

  const filteredAppointments = filterStatus === "All"
    ? appointments
    : appointments.filter((app) => app.status === filterStatus);

  if (loading) return <div>Loading appointments...</div>;

  return (
     <div style={{ display: "flex", justifyContent: "center", padding: "20px", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
      <h2>Appointment Manager</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Filter by Status: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Appointments</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <br />

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Patient Name</th>
            <th>Doctor</th>
            <th>Reason / Notes</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((app) => (
            <tr key={app._id}>
              <td>
                {new Date(app.date).toLocaleDateString()} <br />
                <small>{app.time || new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </td>
              <td>{app.patient?.name || "N/A"}</td>
              <td>Dr. {app.doctor?.name || "Unassigned"}</td>
              <td>{app.reason || "General Checkup"}</td>
              <td>{app.status}</td>
              <td>
                {app.status === "Pending" && (
                  <>
                    <button onClick={() => handleStatusChange(app._id, "Confirmed")}>
                      Confirm
                    </button>
                    {" "}
                    <button onClick={() => handleStatusChange(app._id, "Cancelled")}>
                      Cancel
                    </button>
                  </>
                )}
                {app.status === "Confirmed" && (
                  <button onClick={() => handleStatusChange(app._id, "Completed")}>
                    Mark Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredAppointments.length === 0 && (
            <tr>
              <td colSpan="6">No appointments found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}