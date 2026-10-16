import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import blob from "../../assets/hero-blob.webp";
import { greeting, firstName } from "../../utils/format";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingRequests: 0,
    scheduledToday: 0,
    attendedPatients: 0,
    totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/doctor/dashboard");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch doctor dashboard stats", err);
        setError("Failed to load dashboard overview.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loading text="Preparing your clinical overview…" />;

  return (
    <div className="pt">
      {/* Welcome Banner */}
      <section className="ui-card pt-hero" aria-labelledby="welcome-title">
        <div className="pt-hero__copy">
          <h2 id="welcome-title">{greeting()}, Dr. {firstName(user?.name)}</h2>
          <p>
            Welcome to your clinic dashboard. Review today's queue, manage pending appointment requests, or issue patient prescriptions.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/doctor/appointments" className="ui-btn ui-btn--primary">
              <Icon name="calendar" size={18} /> Manage Appointments
            </Link>
            <Link to="/doctor/prescriptions" className="ui-btn ui-btn--ghost">
              <Icon name="pill" size={18} /> Issue Prescription
            </Link>
          </div>
        </div>
        <img className="pt-hero__art" src={blob} alt="" aria-hidden="true" />
      </section>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {/* Summary Statistics */}
      <div className="pt-stats">
        <Link to="/doctor/appointments" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--amber">
            <Icon name="clock" size={22} />
          </span>
          <span className="pt-stat__label">Pending Requests</span>
          <span className="pt-stat__value">{stats.pendingRequests}</span>
          <span className="pt-stat__hint">Awaiting your review</span>
        </Link>

        <Link to="/doctor/appointments" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--blue">
            <Icon name="calendar" size={22} />
          </span>
          <span className="pt-stat__label">Scheduled Today</span>
          <span className="pt-stat__value">{stats.scheduledToday}</span>
          <span className="pt-stat__hint">Visits on your schedule</span>
        </Link>

        <Link to="/doctor/records" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--green">
            <Icon name="check" size={22} />
          </span>
          <span className="pt-stat__label">Attended Patients</span>
          <span className="pt-stat__value">{stats.attendedPatients}</span>
          <span className="pt-stat__hint">Completed consultations</span>
        </Link>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="pt-section-title">Quick Actions</h2>
        <div className="pt-stats">
          <Link to="/doctor/records" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--blue">
              <Icon name="file" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.1rem" }}>Add Medical Record</span>
            <span className="pt-stat__hint">Log patient diagnosis, clinical findings, and treatment notes</span>
          </Link>

          <Link to="/doctor/prescriptions" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--green">
              <Icon name="pill" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.1rem" }}>Prescribe Medication</span>
            <span className="pt-stat__hint">Issue Rx, auto-deduct inventory, and route to patient billing</span>
          </Link>

          <Link to="/doctor/settings" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--amber">
              <Icon name="settings" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.1rem" }}>Clinic & Profile Settings</span>
            <span className="pt-stat__hint">Update your specialization, consultation hours, or password</span>
          </Link>
        </div>
      </div>
    </div>
  );
}