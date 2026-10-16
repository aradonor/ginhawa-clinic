import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import blob from "../../assets/hero-blob.webp";
import { peso, greeting, firstName } from "../../utils/format";

export default function StaffDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    activeQueue: 0,
    walkInsRegistered: 0,
    todaysRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/staff/dashboard");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch staff dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading text="Preparing today's operational dashboard…" />;

  return (
    <div className="pt">
      {/* Hero Welcome Card */}
      <section className="ui-card pt-hero" aria-labelledby="welcome-title">
        <div className="pt-hero__copy">
          <h2 id="welcome-title">{greeting()}, {firstName(user?.name)}</h2>
          <p>
            Welcome to the Reception & Operations Portal. Manage patient triage, monitor live clinic queues, register walk-ins, and process payments.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/staff/walkin" className="ui-btn ui-btn--primary">
              <Icon name="plus" size={18} /> Register Walk-in
            </Link>
            <Link to="/staff/queue" className="ui-btn ui-btn--ghost">
              <Icon name="clock" size={18} /> Live Queue & Triage
            </Link>
          </div>
        </div>
        <img className="pt-hero__art" src={blob} alt="" aria-hidden="true" />
      </section>

      {/* Operational Metrics Grid */}
      <div className="pt-stats">
        <Link to="/staff/appointments" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--blue">
            <Icon name="calendar" size={22} />
          </span>
          <span className="pt-stat__label">Today's Appointments</span>
          <span className="pt-stat__value">{stats.todayAppointments}</span>
          <span className="pt-stat__hint">Scheduled outpatient visits</span>
        </Link>

        <Link to="/staff/queue" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--amber">
            <Icon name="clock" size={22} />
          </span>
          <span className="pt-stat__label">Active Clinic Queue</span>
          <span className="pt-stat__value">{stats.activeQueue}</span>
          <span className="pt-stat__hint">Patients waiting for doctor</span>
        </Link>

        <Link to="/staff/walkin" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--blue">
            <Icon name="user" size={22} />
          </span>
          <span className="pt-stat__label">Walk-ins Registered</span>
          <span className="pt-stat__value">{stats.walkInsRegistered}</span>
          <span className="pt-stat__hint">Registered at reception today</span>
        </Link>

        <Link to="/staff/billing" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--green">
            <Icon name="receipt" size={22} />
          </span>
          <span className="pt-stat__label">Today's Revenue</span>
          <span className="pt-stat__value">{peso(stats.todaysRevenue)}</span>
          <span className="pt-stat__hint">Payments collected today</span>
        </Link>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="pt-section-title">Reception Quick Actions</h2>
        <div className="pt-stats">
          <Link to="/staff/walkin" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--blue">
              <Icon name="plus" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.05rem" }}>Register Walk-in Patient</span>
            <span className="pt-stat__hint">Quickly register non-scheduled patient visits and queue them</span>
          </Link>

          <Link to="/staff/queue" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--amber">
              <Icon name="clock" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.05rem" }}>Live Queue & Triage</span>
            <span className="pt-stat__hint">Record vitals (BP, Temp) and send patients to available doctors</span>
          </Link>

          <Link to="/staff/patients" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--green">
              <Icon name="users" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.05rem" }}>Patient Directory</span>
            <span className="pt-stat__hint">Search patient records by name, email, or contact number</span>
          </Link>

          <Link to="/staff/billing" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--green">
              <Icon name="receipt" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.05rem" }}>Billing & Payments</span>
            <span className="pt-stat__hint">Review pending invoices and settle patient consultation bills</span>
          </Link>
        </div>
      </div>
    </div>
  );
}