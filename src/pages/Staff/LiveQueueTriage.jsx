import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";

export default function LiveQueueTriage() {
  const [patients, setPatients] = useState([]);
  const [queue, setQueue] = useState([]);

  const [triageData, setTriageData] = useState({
    patientId: "",
    doctorId: "",
    bp: "",
    temperature: "",
    heartRate: "",
    weight: "",
    height: "",
    chiefComplaint: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [queueRes, patientRes] = await Promise.all([
        API.get("/staff/queue"),
        API.get("/staff/patients"),
      ]);
      setQueue(queueRes.data);
      setPatients(patientRes.data);
    } catch (err) {
      setError("Failed to load queue or patient data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setTriageData({ ...triageData, [e.target.name]: e.target.value });
  };

  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await API.post("/staff/triage", triageData);
      setSuccess("Triage completed! Patient added to live doctor queue.");
      setTriageData({
        patientId: "",
        doctorId: "",
        bp: "",
        temperature: "",
        heartRate: "",
        weight: "",
        height: "",
        chiefComplaint: "",
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record triage data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (queueId, newStatus) => {
    try {
      await API.put(`/staff/queue/${queueId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update queue status");
    }
  };

  if (loading) return <Loading text="Loading live queue & triage station…" />;

  return (
    <div className="pt">
      <p className="pt-lead">Record vital signs at reception and manage the active doctor consultation queue.</p>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}
      {success && <p className="ui-alert ui-alert--success" role="status">{success}</p>}

      <div className="pt-book">
        {/* Left Column: Triage Form */}
        <form className="ui-card ui-stack" onSubmit={handleTriageSubmit}>
          <h2 className="pt-section-title" style={{ margin: 0 }}>Triage & Patient Vitals</h2>

          <div className="ui-field">
            <label htmlFor="patientId">Select Patient</label>
            <select
              id="patientId"
              name="patientId"
              value={triageData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Choose patient for triage</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.phone || p.email})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-two">
            <div className="ui-field">
              <label htmlFor="bp">Blood Pressure (BP)</label>
              <input
                id="bp"
                type="text"
                name="bp"
                placeholder="e.g. 120/80"
                value={triageData.bp}
                onChange={handleChange}
              />
            </div>
            <div className="ui-field">
              <label htmlFor="temperature">Temperature (°C)</label>
              <input
                id="temperature"
                type="text"
                name="temperature"
                placeholder="e.g. 36.6"
                value={triageData.temperature}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-two">
            <div className="ui-field">
              <label htmlFor="heartRate">Heart Rate (bpm)</label>
              <input
                id="heartRate"
                type="text"
                name="heartRate"
                placeholder="e.g. 72"
                value={triageData.heartRate}
                onChange={handleChange}
              />
            </div>
            <div className="ui-field">
              <label>Weight (kg) / Height (cm)</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  name="weight"
                  placeholder="Weight"
                  value={triageData.weight}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="height"
                  placeholder="Height"
                  value={triageData.height}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="ui-field">
            <label htmlFor="chiefComplaint">Chief Complaint / Symptoms</label>
            <textarea
              id="chiefComplaint"
              name="chiefComplaint"
              rows={3}
              placeholder="e.g. Mild fever, persistent cough for 3 days"
              value={triageData.chiefComplaint}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="ui-btn ui-btn--primary ui-btn--block" disabled={submitting}>
            <Icon name="check" size={18} />
            {submitting ? "Saving Triage…" : "Submit Triage & Queue Patient"}
          </button>
        </form>

        {/* Right Column: Active Queue Card List */}
        <div className="ui-card">
          <div style={{ paddingBottom: "1rem", marginBottom: "1.2rem", borderBottom: "1px solid var(--gh-border)" }}>
            <h2 className="pt-section-title" style={{ margin: 0 }}>Active Clinic Queue ({queue.length})</h2>
          </div>

          {queue.length === 0 ? (
            <EmptyState
              icon="clock"
              title="Queue is empty"
              text="No patients are currently waiting in the queue."
            />
          ) : (
            <div className="pt-queue-list">
              {queue.map((item) => (
                <div key={item._id} className="pt-queue-item">
                  <div className="pt-queue-item__head">
                    <div>
                      <strong className="pt-queue-item__name">{item.patient?.name || "Unknown Patient"}</strong>
                      <div className="pt-queue-item__sub">{item.vitals?.chiefComplaint || "No complaint specified"}</div>
                    </div>
                    <Badge status={item.status || "Ready for Doctor"} />
                  </div>

                  <div className="pt-queue-item__vitals">
                    <span><strong>BP:</strong> {item.vitals?.bp || "N/A"}</span>
                    <span><strong>Temp:</strong> {item.vitals?.temperature ? `${item.vitals.temperature}°C` : "N/A"}</span>
                  </div>

                  <div className="pt-queue-item__actions">
                    {item.status === "Ready for Doctor" && (
                      <button
                        onClick={() => handleStatusChange(item._id, "In Consultation")}
                        className="ui-btn ui-btn--primary ui-btn--sm ui-btn--block"
                      >
                        Send to Doctor
                      </button>
                    )}
                    {item.status === "In Consultation" && (
                      <button
                        onClick={() => handleStatusChange(item._id, "Completed")}
                        className="ui-btn ui-btn--ghost ui-btn--sm ui-btn--block"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}