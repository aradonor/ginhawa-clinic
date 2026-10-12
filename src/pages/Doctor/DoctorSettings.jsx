import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function DoctorSettings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    clinicHours: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [passError, setPassError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/doctor/profile");
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          specialization: res.data.specialization || "",
          clinicHours: res.data.clinicHours || "",
        });
      } catch (err) {
        setError("Failed to load profile settings");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.put("/doctor/profile", formData);
      setSuccess("Profile settings updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    try {
      const res = await API.put("/doctor/change-password", passwordData);
      setPassSuccess(res.data.message);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPassError(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading settings...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <h2>Doctor Settings & Profile</h2>
        
        {/* Profile Section */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name:</label><br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>
          <div>
            <label>Specialization:</label><br />
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>
          <div>
            <label>Clinic Hours:</label><br />
            <input
              type="text"
              name="clinicHours"
              value={formData.clinicHours}
              onChange={handleChange}
              placeholder="e.g. Mon-Fri: 9AM - 5PM"
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>
          <button type="submit" style={{ padding: "10px 15px" }}>Save Profile</button>
        </form>

        <hr style={{ margin: "40px 0" }} />

        {/* Password Section */}
        <h3>Change Password</h3>
        {passError && <p style={{ color: "red" }}>{passError}</p>}
        {passSuccess && <p style={{ color: "green" }}>{passSuccess}</p>}

        <form onSubmit={handlePasswordSubmit}>
          <div>
            <label>Current Password:</label><br />
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>
          <div>
            <label>New Password:</label><br />
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>
          <button type="submit" style={{ padding: "10px 15px" }}>Update Password</button>
        </form>
      </div>
    </div>
  );
}