import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import blob from "../../assets/hero-blob.webp";
import { greeting, firstName } from "../../utils/format";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    clinicStaff: 0,
    totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/admin/dashboard");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch admin dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading text="Preparing system overview…" />;

  return (
    <div className="pt">
      {/* Admin Hero Banner */}
      <section className="ui-card pt-hero" aria-labelledby="welcome-title">
        <div className="pt-hero__copy">
          <h2 id="welcome-title">{greeting()}, {firstName(user?.name)}</h2>
          <p>
            Welcome to the Clinic Administration Portal. Monitor system metrics, manage user roles, audit inventory stock, and view financial analytics.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/admin/users" className="ui-btn ui-btn--primary">
              <Icon name="users" size={18} /> Manage Users
            </Link>
            <Link to="/admin/reports" className="ui-btn ui-btn--ghost">
              <Icon name="chart" size={18} /> System Reports
            </Link>
          </div>
        </div>
        <img className="pt-hero__art" src={blob} alt="" aria-hidden="true" />
      </section>

      {/* System Metric Cards */}
      <div className="pt-stats">
        <Link to="/admin/users" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--blue">
            <Icon name="users" size={22} />
          </span>
          <span className="pt-stat__label">Total Registered Users</span>
          <span className="pt-stat__value">{stats.totalUsers}</span>
          <span className="pt-stat__hint">All portal accounts</span>
        </Link>

        <Link to="/admin/users" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--green">
            <Icon name="user" size={22} />
          </span>
          <span className="pt-stat__label">Active Doctors</span>
          <span className="pt-stat__value">{stats.activeDoctors}</span>
          <span className="pt-stat__hint">Medical practitioners</span>
        </Link>

        <Link to="/admin/users" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--amber">
            <Icon name="user" size={22} />
          </span>
          <span className="pt-stat__label">Clinic Staff</span>
          <span className="pt-stat__value">{stats.clinicStaff}</span>
          <span className="pt-stat__hint">Triage & billing staff</span>
        </Link>

        <Link to="/admin/reports" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--blue">
            <Icon name="calendar" size={22} />
          </span>
          <span className="pt-stat__label">Total Appointments</span>
          <span className="pt-stat__value">{stats.totalAppointments}</span>
          <span className="pt-stat__hint">All-time clinic visits</span>
        </Link>
      </div>

      {/* Quick Management Links */}
      <div>
        <h2 className="pt-section-title">Quick Management Links</h2>
        <div className="pt-stats">
          <Link to="/admin/users" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--blue">
              <Icon name="users" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.05rem" }}>User Management</span>
            <span className="pt-stat__hint">Add, edit roles, or archive user accounts</span>
          </Link>

          <Link to="/admin/inventory" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--green">
              <Icon name="pill" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.05rem" }}>Inventory & Medicine</span>
            <span className="pt-stat__hint">Manage medicine stock levels and unit prices</span>
          </Link>

          <Link to="/admin/reports" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--amber">
              <Icon name="receipt" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.05rem" }}>Reports & Analytics</span>
            <span className="pt-stat__hint">Financial revenue, invoice status, and volume</span>
          </Link>

          <Link to="/admin/logs" className="ui-card pt-stat">
            <span className="pt-stat__icon pt-stat__icon--red">
              <Icon name="lock" size={22} />
            </span>
            <span className="pt-stat__value" style={{ fontSize: "1.05rem" }}>System Audit Logs</span>
            <span className="pt-stat__hint">Review administrative actions and audit security events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}