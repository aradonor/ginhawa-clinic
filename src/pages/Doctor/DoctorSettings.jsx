import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Loading from "../../components/ui/Loading";
import Icon from "../../components/ui/Icon";
import { initials } from "../../utils/format";

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
        setError("Failed to load profile details");
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
      setSuccess("Profile settings saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    try {
      const res = await API.put("/doctor/change-password", passwordData);
      setPassSuccess(res.data.message || "Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPassError(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) return <Loading text="Loading doctor account settings…" />;

  return (
    <div className="pt">
      <p className="pt-lead">Manage your professional account profile, clinic schedule hours, and portal password.</p>

      <div className="pt-settings">
        {/* Profile Card */}
        <div className="ui-card">
          <div className="pt-profile">
            <div className="pt-profile__avatar">
              {initials(formData.name || "Doctor")}
            </div>
            <div>
              <h2>Dr. {formData.name || "Doctor Profile"}</h2>
              <p>{formData.specialization || "General Practitioner"}</p>
            </div>
          </div>

          <form className="ui-stack" onSubmit={handleSubmit}>
            {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}
            {success && <p className="ui-alert ui-alert--success" role="status">{success}</p>}

            <div className="ui-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ui-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ui-field">
              <label htmlFor="specialization">Medical Specialization</label>
              <input
                id="specialization"
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Internal Medicine, Pediatrics"
              />
            </div>

            <div className="ui-field">
              <label htmlFor="clinicHours">Clinic / Consultation Hours</label>
              <input
                id="clinicHours"
                type="text"
                name="clinicHours"
                value={formData.clinicHours}
                onChange={handleChange}
                placeholder="e.g. Mon - Fri: 9:00 AM - 5:00 PM"
              />
            </div>

            <button type="submit" className="ui-btn ui-btn--primary">
              <Icon name="check" size={16} /> Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="ui-card">
          <h2 className="pt-section-title">Change Portal Password</h2>
          <p className="pt-lead" style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>
            Ensure your account is using a strong password.
          </p>

          <form className="ui-stack" onSubmit={handlePasswordSubmit}>
            {passError && <p className="ui-alert ui-alert--error" role="alert">{passError}</p>}
            {passSuccess && <p className="ui-alert ui-alert--success" role="status">{passSuccess}</p>}

            <div className="ui-field">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="ui-field">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button type="submit" className="ui-btn ui-btn--ghost">
              <Icon name="lock" size={16} /> Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}