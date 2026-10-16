import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/ginhawa-logo.png";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/contact", label: "Contact Us" },
];

const pillClass = (extra = "") => ({ isActive }) =>
  `pill-link ${extra} ${isActive ? "is-active" : ""}`.trim();

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="pub-nav">
      <Link to="/" className="pub-nav__brand" onClick={close}>
        <img src={logo} alt="Ginhawa: Smarter Clinic, Smoother Care." />
      </Link>

      <button
        type="button"
        className="pub-nav__toggle"
        aria-expanded={open}
        aria-controls="pub-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Menu"}
      </button>

      <div
        id="pub-menu"
        className={`pub-nav__menu ${open ? "is-open" : ""}`}
      >
        <nav aria-label="Main">
          <ul className="pub-nav__links">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={pillClass()} onClick={close}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pub-nav__actions">
          <NavLink to="/register" className={pillClass("pill-link--register")} onClick={close}>
            Register
          </NavLink>
          <NavLink to="/login" className={pillClass("pill-link--login")} onClick={close}>
            Login
          </NavLink>
        </div>
      </div>
    </header>
  );
}
