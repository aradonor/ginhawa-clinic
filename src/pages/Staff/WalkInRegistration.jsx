import React, { useState } from "react";
import API from "../../api/axios";
import Icon from "../../components/ui/Icon";

export default function WalkInRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Male",
    address: "",
    reason: "",
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
    <div className="pt">
      <p className="pt-lead">Register non-scheduled patients at reception and generate an immediate appointment record.</p>

      <div className="pt-book">
        <form className="ui-card ui-stack" onSubmit={handleSubmit}>
          {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}
          {message && <p className="ui-alert ui-alert--success" role="status">{message}</p>}

          <div className="ui-field">
            <label htmlFor="name">Full Patient Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Juan Dela Cruz"
              required
            />
          </div>

          <div className="pt-two">
            <div className="ui-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. juan@example.com"
                required
              />
            </div>
            <div className="ui-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0917XXXXXXX"
                required
              />
            </div>
          </div>

          <div className="pt-two">
            <div className="ui-field">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="30"
              />
            </div>
            <div className="ui-field">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="ui-field">
            <label htmlFor="reason">Outpatient Service / Reason for Visit</label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="">Choose service</option>
              <option value="General Checkup / Consultation">Consultation (₱500.00)</option>
              <option value="Follow-up Checkup">Follow-up Checkup (₱300.00)</option>
              <option value="Medical Certificate Evaluation">Medical Certificate Evaluation (₱500.00)</option>
            </select>
          </div>

          <div className="ui-field">
            <label htmlFor="address">Residential Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, City, Province"
            />
          </div>

          <button type="submit" className="ui-btn ui-btn--primary ui-btn--block" disabled={loading}>
            <Icon name="plus" size={18} />
            {loading ? "Registering Walk-in…" : "Register Patient & Queue Visit"}
          </button>
        </form>

        {/* Walk-in Info Side Summary */}
        <aside className="ui-card pt-summary" aria-label="Registration details">
          <h2>Registration Info</h2>
          <dl>
            <div>
              <dt>Patient Name</dt>
              <dd>{formData.name || "Not entered"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{formData.phone || "Not entered"}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{formData.reason || "Not selected"}</dd>
            </div>
          </dl>
          <p className="pt-summary__note">
            Walk-in patients are automatically assigned a default account password (<code>pass123</code>) allowing them to log into the Patient Portal later.
          </p>
        </aside>
      </div>
    </div>
  );
}