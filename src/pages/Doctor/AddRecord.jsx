import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Loading from "../../components/ui/Loading";
import Icon from "../../components/ui/Icon";
import { formatDate, formatTime } from "../../utils/format";

export default function AddRecord() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/doctor/appointments");
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to load patient appointments list");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
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
      await API.post("/doctor/records", formData);
      setSuccess("Medical record added successfully.");
      setFormData({ patientId: "", diagnosis: "", notes: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save record");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading booked patients…" />;

  // Find selected appointment detail for preview
  const selectedApp = appointments.find((app) => {
    const patientObj = typeof app.patient === "object" ? app.patient : null;
    const pId = patientObj?._id || app.patient || app.patientId;
    return pId === formData.patientId;
  });

  const selectedPatientName = selectedApp
    ? (typeof selectedApp.patient === "object" ? selectedApp.patient.name : selectedApp.patientName) || "Patient"
    : null;

  return (
    <div className="pt">
      <p className="pt-lead">Document diagnosis and clinical notes for patients with existing appointments.</p>

      <div className="pt-book">
        <form className="ui-card ui-stack" onSubmit={handleSubmit}>
          {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}
          {success && <p className="ui-alert ui-alert--success" role="status">{success}</p>}

          <div className="ui-field">
            <label htmlFor="patientId">Select Patient</label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a patient from appointments</option>
              {appointments.map((app) => {
                const patientObj = typeof app.patient === "object" ? app.patient : null;
                const pId = patientObj?._id || app.patient || app.patientId;
                const pName = patientObj?.name || app.patientName || "Patient";
                return (
                  <option key={app._id} value={pId}>
                    {pName} — ({app.date ? formatDate(app.date) : "Scheduled"} at {app.time ? formatTime(app.time) : "TBD"})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="ui-field">
            <label htmlFor="diagnosis">Diagnosis / Primary Finding</label>
            <input
              id="diagnosis"
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="e.g. Acute Pharyngitis, Upper Respiratory Tract Infection"
              required
            />
          </div>

          <div className="ui-field">
            <label htmlFor="notes">Consultation & Clinical Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter clinical assessment, vitals, symptom history, or doctor recommendations…"
            />
          </div>

          <button type="submit" className="ui-btn ui-btn--primary ui-btn--block" disabled={submitting}>
            <Icon name="file" size={18} />
            {submitting ? "Saving Medical Record…" : "Save Medical Record"}
          </button>
        </form>

        {/* Live Preview Side Card */}
        <aside className="ui-card pt-summary" aria-label="Record preview">
          <h2>Record Summary</h2>
          <dl>
            <div>
              <dt>Patient</dt>
              <dd>{selectedPatientName || "Not selected"}</dd>
            </div>
            <div>
              <dt>Diagnosis</dt>
              <dd>{formData.diagnosis || "Not entered"}</dd>
            </div>
            <div>
              <dt>Visit Date</dt>
              <dd>{selectedApp?.date ? formatDate(selectedApp.date) : "N/A"}</dd>
            </div>
          </dl>
          <p className="pt-summary__note">
            Saved health records are immediately accessible on the patient's portal under <strong>My Health Records</strong>.
          </p>
        </aside>
      </div>
    </div>
  );
}