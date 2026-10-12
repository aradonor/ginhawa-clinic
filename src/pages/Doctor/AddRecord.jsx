import React, { useState, useEffect } from "react";
import API from "../../api/axios";

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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/doctor/appointments");
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to load booked patient appointments");
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

    try {
      await API.post("/doctor/records", formData);
      setSuccess("Medical record added successfully!");
      setFormData({ patientId: "", diagnosis: "", notes: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save record");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading patient list...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div>
        <h2>Create Medical Record</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Select Booked Patient:</label><br />
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Choose Patient</option>
              {appointments.map((app) => {
                const patientObj = typeof app.patient === "object" ? app.patient : null;
                const pId = patientObj?._id || app.patient || app.patientId;
                const pName = patientObj?.name || app.patientName || "Patient";
                return (
                  <option key={app._id} value={pId}>
                    {pName} ({app.date || "Scheduled"} - {app.time || "Appointment"})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Diagnosis:</label><br />
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Consultation Notes:</label><br />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          <br />
          <button type="submit">Submit Record</button>
        </form>
      </div>
    </div>
  );
}