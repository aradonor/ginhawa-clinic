import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import { dateParts, formatDate, formatTime } from "../../utils/format";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

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

  const filtered = filterStatus === "All"
    ? appointments
    : appointments.filter((a) => a.status === filterStatus);

  if (loading) return <Loading text="Loading scheduled patient consultations…" />;

  return (
    <div className="pt">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <p className="pt-lead" style={{ margin: 0 }}>Manage your scheduled patient consultations and appointment requests.</p>
        
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
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {filtered.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No appointments found"
          text={filterStatus === "All" ? "You have no scheduled patient appointments." : `No appointments with status "${filterStatus}".`}
        />
      ) : (
        <ul className="pt-list">
          {filtered.map((apt) => {
            const patientObj = typeof apt.patient === "object" ? apt.patient : null;
            const patientName = patientObj?.name || apt.patientName || "Patient";
            const patientEmail = patientObj?.email || apt.patientEmail || "No email provided";
            const parts = dateParts(apt.date);

            return (
              <li key={apt._id} className="pt-row">
                <div className="pt-date" aria-hidden="true">
                  {parts ? (
                    <>
                      <strong>{parts.day}</strong>
                      <span>{parts.month}</span>
                    </>
                  ) : (
                    <Icon name="calendar" size={20} />
                  )}
                </div>

                <div style={{ minWidth: 0 }}>
                  <h3 className="pt-row__title">{patientName}</h3>
                  <div className="pt-row__meta">
                    <span>
                      <Icon name="user" size={15} />
                      {patientEmail}
                    </span>
                    <span>
                      <Icon name="calendar" size={15} />
                      {formatDate(apt.date)}
                    </span>
                    <span>
                      <Icon name="clock" size={15} />
                      {formatTime(apt.time)}
                    </span>
                    <span>
                      <Icon name="file" size={15} />
                      {apt.reason || "Consultation"}
                    </span>
                  </div>
                </div>

                <div className="pt-row__side">
                  <Badge status={apt.status || "Pending"} />
                  {apt.status === "Pending" && (
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => handleStatusChange(apt._id, "Confirmed")}
                        className="ui-btn ui-btn--primary ui-btn--sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(apt._id, "Cancelled")}
                        className="ui-btn ui-btn--danger ui-btn--sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {apt.status === "Confirmed" && (
                    <button
                      onClick={() => handleStatusChange(apt._id, "Completed")}
                      className="ui-btn ui-btn--ghost ui-btn--sm"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}