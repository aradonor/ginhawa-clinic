import React from "react";

// Maps a status word to a calm colour. Unknown words fall back to grey.
const TONES = {
  pending: "amber",
  scheduled: "blue",
  confirmed: "blue",
  "in progress": "blue",
  completed: "green",
  paid: "green",
  active: "green",
  cancelled: "grey",
  canceled: "grey",
  unpaid: "red",
  overdue: "red",
};

export default function Badge({ status, children }) {
  const text = children || status || "Pending";
  const tone = TONES[String(text).toLowerCase()] || "grey";
  return <span className={`ui-badge ui-badge--${tone}`}>{text}</span>;
}
