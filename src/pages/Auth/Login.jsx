import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

try {
        const user = await login(email, password);
        console.log("Logged in user object:", user); // Check what prints here

        if (user.role === "patient") {
          navigate("/patient/dashboard");
        } else if (user.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (user.role === "staff") {
          navigate("/staff/dashboard");
        } else if (user.role === "admin") {
          console.log("Attempting navigation to /admin/dashboard...");
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
    } catch (err) {
        console.error("Login navigation error:", err); // Check if it catches an error here
        setError(
          err.response?.data?.message || err.response?.data?.error || "Invalid email or password"
        );
    }
    };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div>
        <h2>Ginhawa CMS - Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email Address:</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <br />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}