import React from "react";

// Grouped by who uses them. These match the portals and routes in App.js.
const FEATURES = [
  {
    role: "For patients",
    items: [
      ["Book appointments", "Pick a doctor and schedule a visit online."],
      ["My appointments", "Track upcoming and past visits."],
      ["Health records", "Read consultation notes and diagnoses."],
      ["Prescriptions", "See what the doctor issued to you."],
      ["Billing", "Check your balance and payment history."],
    ],
  },
  {
    role: "For doctors",
    items: [
      ["Patient appointments", "See the day's schedule at a glance."],
      ["Medical records", "Add consultation notes after each visit."],
      ["Prescriptions", "Issue prescriptions to patients."],
    ],
  },
  {
    role: "For staff",
    items: [
      ["Appointment manager", "Confirm, reschedule, or cancel bookings."],
      ["Walk-ins and registration", "Register patients who arrive without a booking."],
      ["Live queue and triage", "Order the waiting room by priority."],
      ["Patient database", "Search and update patient details."],
      ["Billing and payments", "Record charges and payments."],
    ],
  },
  {
    role: "For admins",
    items: [
      ["User management", "Create and manage staff, doctor, and patient accounts."],
      ["Inventory and supplies", "Keep medicine and supply stock up to date."],
      ["Reports and analytics", "Review clinic activity and revenue."],
      ["Audit log", "See who changed what, and when."],
    ],
  },
];

export default function Features() {
  return (
    <div className="pub-page features">
      <h1 className="page-title">
        <span className="display text-red">Ginhawa</span> Features
      </h1>
      <div className="feature-grid">
        {FEATURES.map((group) => (
          <section key={group.role} className="feature-card" aria-label={group.role}>
            <h2 className="feature-card__role display">{group.role}</h2>
            <ul>
              {group.items.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
