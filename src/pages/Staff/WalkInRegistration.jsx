import React, { useState } from "react";
import API from "../../api/axios";

export default function WalkInRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Male",
    address: "",
    reason: "", // Added appointment reason
    password: "pass123",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await API.post("/staff/register-walkin", formData);
      setMessage(res.data.message || "Walk-in patient registered successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "Male",
        address: "",
        reason: "",
        password: "pass123",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
      <h2>Walk-in Patient Registration</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email Address:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label><br />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label><br />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label><br />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Reason for Visit / Service:</label><br />
          <select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Outpatient Service --</option>
            <option value="General Checkup / Consultation">Consultation (₱500.00)</option>
            <option value="Follow-up Checkup">Checkup (₱500.00)</option>
            <option value="Medical Certificate Evaluation">Follow-up Checkup (₱300.00)</option>
          </select>
        </div>
        <div>
          <label>Address:</label><br />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Patient & Queue Appointment"}
        </button>
      </form>
      </div>
    </div>
  );
}