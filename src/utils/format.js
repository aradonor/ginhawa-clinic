// Small formatting helpers for the portal pages.

export const peso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;

// "2026-10-20" -> Date (local time). Returns null when the value is not a date.
export function toDate(value) {
  if (!value) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value) {
  const d = toDate(value);
  if (!d) return value || "N/A";
  return d.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function dateParts(value) {
  const d = toDate(value);
  if (!d) return null;
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("en-PH", { month: "short" }),
    year: d.getFullYear(),
  };
}

// "14:30" -> "2:30 PM". Leaves anything else untouched.
export function formatTime(value) {
  const m = /^(\d{1,2}):(\d{2})/.exec(value || "");
  if (!m) return value || "";
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]} ${h >= 12 ? "PM" : "AM"}`;
}

// Today as YYYY-MM-DD in the user's own time zone (for <input type="date" min>).
export function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export const firstName = (name) => (name || "").trim().split(/\s+/)[0] || "there";

export const initials = (name) =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
