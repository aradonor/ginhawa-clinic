import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "Consultation", // Default value
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

    try {
      await API.post("/appointments", formData);
      setSuccess("Appointment booked successfully!");
      setFormData({ doctorId: "", date: "", time: "", reason: "Consultation" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading booking options...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h2>Book an Appointment</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Select Doctor:</label><br />
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} {doc.specialization ? `- ${doc.specialization}` : ""}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div>
            <label>Date:</label><br />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <br />
          <div>
            <label>Time:</label><br />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <br />
          <div>
            <label>Reason for Visit:</label><br />
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="Consultation">Consultation - ₱500</option>
              <option value="Checkup">Checkup - ₱500</option>
              <option value="Follow-up Checkup">Follow-up Checkup - ₱300</option>
            </select>
          </div>
          <br />
          <button type="submit" style={{ width: "100%", padding: "10px" }}>Request Booking</button>
        </form>
      </div>
    </div>
  );
}