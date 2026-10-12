import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get("/patient/prescriptions");
        setPrescriptions(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading prescriptions...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div>
        <h2>Prescriptions</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Date Issued</th>
                <th>Doctor</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
            {prescriptions.map((p) => {
              const dateVal = p.date || p.createdAt?.split("T")[0] || "N/A";
              const docName = p.doctorName || p.doctor?.name || "Attending Physician";
              
              // Check if the prescription uses a medicines array or root-level fields
              const medsList = p.medicines && p.medicines.length > 0 ? p.medicines : null;

              if (medsList) {
                // Render each medicine inside the array
                return medsList.map((med, index) => (
                  <tr key={`${p._id}-${index}`}>
                    <td>{index === 0 ? dateVal : ""}</td>
                    <td>{index === 0 ? docName : ""}</td>
                    <td>{med.medication || med.name || med.itemName || "N/A"}</td>
                    <td>{med.dosage || med.dose || "N/A"}</td>
                    <td>{med.instructions || med.note || "N/A"}</td>
                  </tr>
                ));
              }

              // Fallback for single root-level structure
              return (
                <tr key={p._id}>
                  <td>{dateVal}</td>
                  <td>{docName}</td>
                  <td>{p.medication || p.medicineName || "No medicines listed"}</td>
                  <td>{p.dosage || "N/A"}</td>
                  <td>{p.instructions || "N/A"}</td>
                </tr>
              );
            })}
            {prescriptions.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No prescriptions found.</td>
              </tr>
            )}
          </tbody>
          </table>
        )}
      </div>
    </div>
  );
}