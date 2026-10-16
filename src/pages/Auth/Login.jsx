import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FormField from "../../components/public/FormField";
import { validate, required, isEmail } from "../../utils/validators";

const ROLE_HOME = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  staff: "/staff/dashboard",
  admin: "/admin/dashboard",
};

const RULES = {
  email: [required("Email address"), (v) => (isEmail(v) ? "" : "Enter a valid email address.")],
  password: [required("Password")],
};

export default function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
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
      const user = await login(values.email.trim(), values.password);
      navigate(ROLE_HOME[user.role] || "/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || "Invalid email or password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pub-page auth">
      <h1 className="auth__title display">Login</h1>
      <p className="auth__sub">Login to access Ginhawa account</p>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {error && <p className="form-alert form-alert--error" role="alert">{error}</p>}

        <div className="form-grid">
          <FormField label="Email Address" name="email" type="email" autoComplete="email"
            className="span-2" value={values.email} onChange={onChange} error={errors.email} />
          <FormField label="Password" name="password" type="password" autoComplete="current-password"
            className="span-2" value={values.password} onChange={onChange} error={errors.password} />
        </div>

        <div className="auth__row">
          <button className="btn-pill" type="submit" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </button>
          <Link className="auth__link" to="/contact">I forgot my password</Link>
        </div>
      </form>
    </div>
  );
}
