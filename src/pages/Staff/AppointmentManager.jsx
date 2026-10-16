import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Loading from "../../components/ui/Loading";
import { formatDate, formatTime } from "../../utils/format";

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

  if (loading) return <Loading text="Loading appointment records…" />;

  const formatDoctorName = (doc) => {
    const raw = doc?.name || doc || "Unassigned";
    if (raw === "Unassigned") return "Unassigned";
    return raw.startsWith("Dr.") ? raw : `Dr. ${raw}`;
  };

  return (
    <div className="pt">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <p className="pt-lead" style={{ margin: 0 }}>Review, confirm, or mark completed all online and walk-in appointments.</p>
        
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label htmlFor="filterStatus" style={{ fontSize: "0.88rem", fontWeight: "600", color: "var(--gh-muted)", whiteSpace: "nowrap" }}>
            Filter Status:
          </label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--gh-line)",
              fontSize: "0.88rem",
              background: "#fff"
            }}
          >
            <option value="All">All Appointments</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No appointments found"
          text={filterStatus === "All" ? "No appointments are currently scheduled." : `No appointments with status "${filterStatus}".`}
        />
      ) : (
        <div className="ui-table-card">
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th style={{ width: "18%" }}>Date & Time</th>
                  <th style={{ width: "20%" }}>Patient Name</th>
                  <th style={{ width: "18%" }}>Attending Doctor</th>
                  <th style={{ width: "22%" }}>Reason / Notes</th>
                  <th style={{ width: "10%" }}>Status</th>
                  <th style={{ width: "12%", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => (
                  <tr key={app._id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: "600" }}>{formatDate(app.date)}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--gh-muted)" }}>
                        {app.time ? formatTime(app.time) : "TBD"}
                      </div>
                    </td>
                    <td style={{ fontWeight: "600", whiteSpace: "nowrap" }}>
                      {app.patient?.name || app.patientName || "Walk-in Patient"}
                    </td>
                    <td style={{ color: "var(--gh-muted)", whiteSpace: "nowrap" }}>
                      {formatDoctorName(app.doctor)}
                    </td>
                    <td style={{ color: "var(--gh-muted)", maxWidth: "220px", wordWrap: "break-word" }}>
                      {app.reason || "General Checkup"}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Badge status={app.status || "Pending"} />
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        {app.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app._id, "Confirmed")}
                              className="ui-btn ui-btn--primary ui-btn--sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusChange(app._id, "Cancelled")}
                              className="ui-btn ui-btn--danger ui-btn--sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {app.status === "Confirmed" && (
                          <button
                            onClick={() => handleStatusChange(app._id, "Completed")}
                            className="ui-btn ui-btn--ghost ui-btn--sm"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}