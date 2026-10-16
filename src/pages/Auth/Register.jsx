import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FormField from "../../components/public/FormField";
import { validate, required, isEmail } from "../../utils/validators";

const EMPTY = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

const RULES = {
  firstName: [required("First name")],
  lastName: [required("Last name")],
  email: [required("Email address"), (v) => (isEmail(v) ? "" : "Enter a valid email address.")],
  password: [
    required("Password"),
    (v) => (v.length >= 8 ? "" : "Use at least 8 characters."),
  ],
  confirmPassword: [
    required("Confirm password"),
    (v, all) => (v === all.password ? "" : "Passwords do not match."),
  ],
};

export default function Register() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const found = validate(values, RULES);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      // The API stores a single "name", so the two design fields are joined.
      await register({
        name: `${values.firstName.trim()} ${values.lastName.trim()}`,
        email: values.email.trim(),
        password: values.password,
        role: "patient",
      });
      navigate("/patient/book-appointment");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pub-page auth">
      <h1 className="auth__title display">Register now!</h1>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {error && <p className="form-alert form-alert--error" role="alert">{error}</p>}

        <div className="form-grid">
          <FormField label="First Name" name="firstName" autoComplete="given-name"
            value={values.firstName} onChange={onChange} error={errors.firstName} />
          <FormField label="Last Name" name="lastName" autoComplete="family-name"
            value={values.lastName} onChange={onChange} error={errors.lastName} />
          <FormField label="Email Address" name="email" type="email" autoComplete="email"
            className="span-2" value={values.email} onChange={onChange} error={errors.email} />
          <FormField label="Password" name="password" type="password" autoComplete="new-password"
            className="span-2" value={values.password} onChange={onChange} error={errors.password} />
          <FormField label="Confirm Password" name="confirmPassword" type="password" autoComplete="new-password"
            className="span-2" value={values.confirmPassword} onChange={onChange} error={errors.confirmPassword} />
        </div>

        <div className="auth__row">
          <button className="btn-pill" type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
