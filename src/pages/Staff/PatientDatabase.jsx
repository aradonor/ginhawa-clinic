import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function PatientDatabase() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      const res = await API.get("/staff/patients");
      setPatients(res.data);
    } catch (err) {
      setError("Failed to load patient directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  if (loading) return <div>Loading patient database...</div>;

  return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
      <h2>Patient Directory & Database</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Search by name, email, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <br />

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Gender / Age</th>
            <th>Registration Type</th>
            <th>Registered Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.phone || "N/A"}</td>
              <td>{p.gender || "N/A"} / {p.age || "N/A"}</td>
              <td>{p.isWalkIn ? "Walk-in" : "Online Registration"}</td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {filteredPatients.length === 0 && (
            <tr>
              <td colSpan="6">No patients found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}