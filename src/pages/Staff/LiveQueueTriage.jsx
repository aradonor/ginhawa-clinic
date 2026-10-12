import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function LiveQueueTriage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
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

  const fetchData = async () => {
    try {
      // Fetch patients, queue items, and profile/user list
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

    try {
      await API.post("/staff/triage", triageData);
      setSuccess("Triage completed and patient added to queue!");
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
      fetchData(); // Refresh queue list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record triage data");
    }
  };

  const handleStatusChange = async (queueId, newStatus) => {
    try {
      await API.put(`/staff/queue/${queueId}/status`, { status: newStatus });
      fetchData(); // Refresh queue list
    } catch (err) {
      alert("Failed to update queue status");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading queue & triage...</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", padding: "10px" }}>
      {/* Triage Form */}
      <div>
        <h3>Patient Triage & Vital Signs</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleTriageSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Select Patient:</label><br />
            <select
              name="patientId"
              value={triageData.patientId}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.phone || p.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Blood Pressure (BP):</label>
              <input
                type="text"
                name="bp"
                placeholder="e.g. 120/80"
                value={triageData.bp}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Temperature (°C):</label>
              <input
                type="text"
                name="temperature"
                placeholder="e.g. 36.6"
                value={triageData.temperature}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Heart Rate (bpm):</label>
              <input
                type="text"
                name="heartRate"
                placeholder="e.g. 72"
                value={triageData.heartRate}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Weight (kg) / Height (cm):</label>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="text"
                  name="weight"
                  placeholder="Weight"
                  value={triageData.weight}
                  onChange={handleChange}
                  style={{ width: "50%", padding: "8px", marginTop: "5px" }}
                />
                <input
                  type="text"
                  name="height"
                  placeholder="Height"
                  value={triageData.height}
                  onChange={handleChange}
                  style={{ width: "50%", padding: "8px", marginTop: "5px" }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Chief Complaint / Symptoms:</label>
            <textarea
              name="chiefComplaint"
              rows="3"
              placeholder="e.g. Mild fever, persistent cough for 3 days"
              value={triageData.chiefComplaint}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <button
            type="submit"
            style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
          >
            Submit Triage & Queue Patient
          </button>
        </form>
      </div>

      {/* Live Queue Monitor */}
      <div>
        <h3>Live Clinic Queue</h3>
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>Patient</th>
              <th>Vitals (BP/Temp)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.patient?.name || "Unknown Patient"}</strong><br />
                  <small>{item.vitals?.chiefComplaint || "No complaint specified"}</small>
                </td>
                <td>
                  <small>BP: {item.vitals?.bp || "N/A"}</small><br />
                  <small>Temp: {item.vitals?.temperature ? `${item.vitals.temperature}°C` : "N/A"}</small>
                </td>
                <td>
                  <span style={{
                    fontWeight: "bold",
                    color: item.status === "Ready for Doctor" ? "green" : item.status === "In Consultation" ? "blue" : "gray"
                  }}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status === "Ready for Doctor" && (
                    <button onClick={() => handleStatusChange(item._id, "In Consultation")}>
                      Send to Doctor
                    </button>
                  )}
                  {item.status === "In Consultation" && (
                    <button onClick={() => handleStatusChange(item._id, "Completed")}>
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {queue.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No patients currently in queue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}