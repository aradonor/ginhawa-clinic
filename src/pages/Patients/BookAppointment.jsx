import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import Loading from "../../components/ui/Loading";
import { peso, formatDate, formatTime, todayISO } from "../../utils/format";

const REASONS = [
  { value: "Consultation", label: "Consultation", fee: 500 },
  { value: "Checkup", label: "Checkup", fee: 500 },
  { value: "Follow-up Checkup", label: "Follow-up checkup", fee: 300 },
];

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "Consultation",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("/appointments/doctors");
        setDoctors(res.data);
      } catch (err) {
        setError("Failed to load available doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await API.post("/appointments", formData);
      setSuccess("Your appointment request was sent.");
      setFormData({ doctorId: "", date: "", time: "", reason: "Consultation" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading booking options…" />;

  const doctor = doctors.find((d) => d._id === formData.doctorId);
  const reason = REASONS.find((r) => r.value === formData.reason) || REASONS[0];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* <Sidebar /> */}
      
      <div style={{ marginLeft: "260px", padding: "2.5rem", width: "100%", boxSizing: "border-box" }}>
        <div className="pt">
          <p className="pt-lead">Choose a doctor and a time that works for you. The clinic will review your request.</p>

          <div className="pt-book">
            <form className="ui-card ui-stack" onSubmit={handleSubmit}>
              {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}
              {success && (
                <p className="ui-alert ui-alert--success" role="status">
                  {success} <Link to="/patient/appointments">View my appointments</Link>
                </p>
              )}

              <div className="ui-field">
                <label htmlFor="doctorId">Doctor</label>
                <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                  <option value="">Choose a doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} {doc.specialization ? `- ${doc.specialization}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-two">
                <div className="ui-field">
                  <label htmlFor="date">Date</label>
                  <input id="date" type="date" name="date" min={todayISO()} value={formData.date} onChange={handleChange} required />
                </div>
                <div className="ui-field">
                  <label htmlFor="time">Time</label>
                  <input id="time" type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>

              <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
                <legend className="ui-label">Reason for visit</legend>
                <div className="pt-choices">
                  {REASONS.map((r) => (
                    <label key={r.value} className="pt-choice">
                      <input type="radio" name="reason" value={r.value} checked={formData.reason === r.value} onChange={handleChange} />
                      <strong>{r.label}</strong>{" "} {/* Added space here */}
                      <span>{peso(r.fee)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="submit" className="ui-btn ui-btn--primary ui-btn--block" disabled={submitting}>
                {submitting ? "Sending request…" : "Request booking"}
              </button>
            </form>

            <aside className="ui-card pt-summary" aria-label="Booking summary">
              <h2>Your visit</h2>
              <dl>
                <div><dt>Doctor</dt><dd>{doctor ? doctor.name : "Not chosen yet"}</dd></div>
                <div><dt>Date</dt><dd>{formData.date ? formatDate(formData.date) : "Not chosen yet"}</dd></div>
                <div><dt>Time</dt><dd>{formData.time ? formatTime(formData.time) : "Not chosen yet"}</dd></div>
                <div><dt>Reason</dt><dd>{reason.label}</dd></div>
                <div className="pt-summary__total" style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                  <dt>Consultation fee</dt><dd>{peso(reason.fee)}</dd>
                </div>
              </dl>
              <p className="pt-summary__note">Your request is sent to the clinic, which will confirm the visit. You can cancel it from My Appointments.</p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}