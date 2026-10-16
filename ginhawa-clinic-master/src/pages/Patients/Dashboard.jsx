import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import blob from "../../assets/hero-blob.webp";
import { peso, formatDate, formatTime, greeting, firstName } from "../../utils/format";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingAppointment: null,
    activePrescriptionsCount: 0,
    unpaidBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch appointments, prescriptions, and billing to calculate summary cards
        const [appRes, prescRes, billRes] = await Promise.all([
          API.get("/patient/appointments").catch(() => ({ data: [] })),
          API.get("/patient/prescriptions").catch(() => ({ data: [] })),
          API.get("/patient/billing").catch(() => ({ data: [] })),
        ]);

        // Find next upcoming appointment
        const upcoming = appRes.data.find((app) => app.status === "Pending" || app.status === "Scheduled");

        // Count active prescriptions
        const activePresc = prescRes.data.filter((p) => p.status === "Active").length;

        // Calculate total unpaid bills
        const unpaidTotal = billRes.data
          .filter((b) => (b.status || b.paymentStatus) === "Unpaid")
          .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);

        setStats({
          upcomingAppointment: upcoming || null,
          activePrescriptionsCount: activePresc,
          unpaidBalance: unpaidTotal,
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading text="Getting your summary ready…" />;

  const next = stats.upcomingAppointment;

  return (
    <div className="pt">
      <section className="ui-card pt-hero" aria-labelledby="welcome-title">
        <div className="pt-hero__copy">
          <h2 id="welcome-title">{greeting()}, {firstName(user?.name)}</h2>
          <p>Here is a quick look at your care. Book a visit, check your prescriptions, or review your bills whenever you need.</p>
          <Link to="/patient/book-appointment" className="ui-btn ui-btn--primary">
            <Icon name="plus" size={18} /> Book an appointment
          </Link>
        </div>
        <img className="pt-hero__art" src={blob} alt="" aria-hidden="true" />
      </section>

      <div className="pt-stats">
        <Link to="/patient/appointments" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--blue"><Icon name="calendar" /></span>
          <span className="pt-stat__label">Next appointment</span>
          <span className="pt-stat__value">{next ? formatDate(next.date) : "None scheduled"}</span>
          <span className="pt-stat__hint">
            {next
              ? `${formatTime(next.time)}${next.doctorName ? ` with ${next.doctorName}` : ""}`
              : "Book a visit when you are ready"}
          </span>
        </Link>

        <Link to="/patient/prescriptions" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--green"><Icon name="pill" /></span>
          <span className="pt-stat__label">Active prescriptions</span>
          <span className="pt-stat__value">{stats.activePrescriptionsCount}</span>
          <span className="pt-stat__hint">View your medicines</span>
        </Link>

        <Link to="/patient/billing" className="ui-card pt-stat">
          <span className="pt-stat__icon pt-stat__icon--red"><Icon name="receipt" /></span>
          <span className="pt-stat__label">Unpaid balance</span>
          <span className="pt-stat__value">{peso(stats.unpaidBalance)}</span>
          <span className="pt-stat__hint">{stats.unpaidBalance > 0 ? "View billing details" : "You are all settled"}</span>
        </Link>
      </div>
    </div>
  );
}
