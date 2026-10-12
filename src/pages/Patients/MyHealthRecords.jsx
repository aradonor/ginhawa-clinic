import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await API.get("/patient/records");
        setRecords(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load health records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading health records...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div>
        <h2>Health Records</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {records.length === 0 ? (
          <p>No medical records found.</p>
        ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id || rec.id}>
                <td>{rec.date || (rec.createdAt ? rec.createdAt.split("T")[0] : "N/A")}</td>
                <td>{rec.doctorName || rec.doctor?.name || "Dr. Garcia"}</td>
                <td>{rec.diagnosis}</td>
                <td>{rec.notes || rec.treatmentPlan || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}