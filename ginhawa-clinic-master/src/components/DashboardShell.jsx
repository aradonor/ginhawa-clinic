import React, { useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ginhawa-logo.png";
import { initials } from "../utils/format";
import Icon from "./ui/Icon";

const ROLE_HOME = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  staff: "/staff/dashboard",
  admin: "/admin/dashboard",
};

export default function DashboardShell({ role, portalName, links }) {
  const { user, loading, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;

  const current = links.find((l) => pathname.startsWith(l.to));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dash">
      <aside className={`dash__side ${open ? "is-open" : ""}`}>
        <div className="dash__brand">
          <img src={logo} alt="Ginhawa" />
          <button
            type="button"
            className="dash__toggle"
            aria-expanded={open}
            aria-controls="dash-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        <div id="dash-nav" className="dash__menu">
          <p className="dash__portal">{portalName}</p>
          <nav aria-label={`${portalName} navigation`}>
            <ul>
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) => `dash__link ${isActive ? "is-active" : ""}`}
                    onClick={() => setOpen(false)}
                    title={l.label}
                  >
                    <span className="dash__link-icon">
                      <Icon name={l.icon || "home"} size={20} />
                    </span>
                    <span className="dash__link-text">{l.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="dash__user">
            <span className="dash__avatar" aria-hidden="true">{initials(user.name)}</span>
            <div className="dash__user-info">
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>

          <button type="button" className="dash__logout" onClick={handleLogout} title="Logout">
            <Icon name="logout" size={18} />
            <span className="dash__logout-text">Logout</span>
          </button>
        </div>
      </aside>

      <main className="dash__main">
        <h1 className="dash__title">{current ? current.label : "Dashboard"}</h1>
        <div className="dash-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}