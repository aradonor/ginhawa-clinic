import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import { Link } from "react-router-dom";
import { dateParts, formatDate, formatTime } from "../../utils/format";

const isOpen = (apt) => apt.status !== "Cancelled" && apt.status !== "Completed";

function AppointmentRow({ apt, onCancel }) {
  const parts = dateParts(apt.date);
  const open = isOpen(apt);
  return (
    <li className="ui-card pt-row">
      <div className={`pt-date ${open ? "" : "pt-date--past"}`} aria-hidden="true">
        {parts ? (<><strong>{parts.day}</strong><span>{parts.month}</span></>) : <Icon name="calendar" />}
      </div>
      <div>
        <h3 className="pt-row__title">{apt.doctorName || "Doctor"}</h3>
        <p className="pt-row__meta">
          <span><Icon name="calendar" size={15} />{formatDate(apt.date)}</span>
          <span><Icon name="clock" size={15} />{formatTime(apt.time)}</span>
          <span><Icon name="file" size={15} />{apt.reason || "N/A"}</span>
        </p>
      </div>
      <div className="pt-row__side">
        <Badge status={apt.status || "Pending"} />
        {open && (
          <button className="ui-btn ui-btn--danger ui-btn--sm" onClick={() => onCancel(apt._id || apt.id)}>
            Cancel
          </button>
        )}
      </div>
    </li>
  );
}

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

  if (loading) return <Loading text="Loading your appointments…" />;

  const upcoming = appointments.filter(isOpen);
  const past = appointments.filter((a) => !isOpen(a));

  return (
    <div className="pt">
      <p className="pt-lead">Your upcoming visits and past appointments in one place.</p>
      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {appointments.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No appointments yet"
          text="When you book a visit, it will show up here so you can keep track of it."
          actionTo="/patient/book-appointment"
          actionLabel="Book an appointment"
        />
      ) : (
        <>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem", gap: "1rem" }}>
              <h2 className="pt-section-title" style={{ margin: 0 }}>Upcoming</h2>
              <Link to="/patient/book-appointment" className="ui-btn ui-btn--primary ui-btn--sm">
                <Icon name="plus" size={16} /> New appointment
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="pt-lead" style={{ margin: 0 }}>Nothing coming up right now.</p>
            ) : (
              <ul className="pt-list">
                {upcoming.map((apt) => (
                  <AppointmentRow key={apt._id || apt.id} apt={apt} onCancel={handleCancel} />
                ))}
              </ul>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <h2 className="pt-section-title">Past and cancelled</h2>
              <ul className="pt-list">
                {past.map((apt) => (
                  <AppointmentRow key={apt._id || apt.id} apt={apt} onCancel={handleCancel} />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
