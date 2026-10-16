import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/ui/Loading";
import Icon from "../../components/ui/Icon";
import { initials } from "../../utils/format";

export default function PatientSettings() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
    // If user object is loaded from context, prepopulate fields
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setLoading(false);
    }
  }, [user]);

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
      await API.put("/patient/profile", formData);
      setSuccess("Profile settings updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile settings");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    try {
      const res = await API.put("/patient/change-password", passwordData);
      setPassSuccess(res.data.message);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPassError(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) return <Loading text="Loading your settings…" />;

  return (
    <div className="pt">
      <p className="pt-lead">Keep your details up to date and your account secure.</p>

      <div className="pt-settings">
        <section className="ui-card" aria-labelledby="profile-title">
          <div className="pt-profile">
            <span className="pt-profile__avatar" aria-hidden="true">{initials(formData.name)}</span>
            <div>
              <h2 id="profile-title">Profile</h2>
              <p>Your contact details</p>
            </div>
          </div>

          {error && <p className="ui-alert ui-alert--error" role="alert" style={{ marginBottom: "1rem" }}>{error}</p>}
          {success && <p className="ui-alert ui-alert--success" role="status" style={{ marginBottom: "1rem" }}>{success}</p>}

          <form className="ui-stack" onSubmit={handleSubmit}>
            <div className="ui-field">
              <label htmlFor="name">Full name</label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="ui-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" name="email" value={formData.email} disabled />
              <small>Your email cannot be changed.</small>
            </div>
            <div className="ui-field">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div><button type="submit" className="ui-btn ui-btn--primary">Save profile</button></div>
          </form>
        </section>

        <section className="ui-card" aria-labelledby="password-title">
          <div className="pt-profile">
            <span className="pt-profile__avatar" aria-hidden="true" style={{ background: "var(--gh-blue-soft)", color: "var(--gh-blue)" }}>
              <Icon name="lock" />
            </span>
            <div>
              <h2 id="password-title">Change password</h2>
              <p>Use a password only you know</p>
            </div>
          </div>

          {passError && <p className="ui-alert ui-alert--error" role="alert" style={{ marginBottom: "1rem" }}>{passError}</p>}
          {passSuccess && <p className="ui-alert ui-alert--success" role="status" style={{ marginBottom: "1rem" }}>{passSuccess}</p>}

          <form className="ui-stack" onSubmit={handlePasswordSubmit}>
            <div className="ui-field">
              <label htmlFor="currentPassword">Current password</label>
              <input id="currentPassword" type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required autoComplete="current-password" />
            </div>
            <div className="ui-field">
              <label htmlFor="newPassword">New password</label>
              <input id="newPassword" type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required autoComplete="new-password" />
            </div>
            <div><button type="submit" className="ui-btn ui-btn--primary">Update password</button></div>
          </form>
        </section>
      </div>
    </div>
  );
}
