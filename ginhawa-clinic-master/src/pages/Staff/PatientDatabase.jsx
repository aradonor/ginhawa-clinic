import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import { formatDate } from "../../utils/format";

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

  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm))
  );

  if (loading) return <Loading text="Loading patient database…" />;

  return (
    <div className="pt">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <p className="pt-lead" style={{ margin: 0 }}>Search registered patient accounts and view personal contact profiles.</p>

        <div style={{ position: "relative", minWidth: "18rem" }}>
          <input
            type="text"
            placeholder="Search by name, email, or phone…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem 1rem 0.55rem 2.2rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--gh-line)",
              fontSize: "0.9rem"
            }}
          />
          <span style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "var(--gh-muted)" }}>
            <Icon name="search" size={16} />
          </span>
        </div>
      </div>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {filteredPatients.length === 0 ? (
        <EmptyState
          icon="users"
          title="No patients found"
          text={searchTerm ? `No patient matching "${searchTerm}" was found.` : "No patients recorded in database."}
        />
      ) : (
        <div className="ui-table-card">
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Patient Name</th>
                  <th style={{ width: "26%" }}>Email Address</th>
                  <th style={{ width: "16%" }}>Phone Number</th>
                  <th style={{ width: "14%" }}>Gender / Age</th>
                  <th style={{ width: "10%" }}>Registration Type</th>
                  <th style={{ width: "12%", textAlign: "right" }}>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: "600", whiteSpace: "nowrap" }}>{p.name}</td>
                    <td style={{ color: "var(--gh-muted)", wordBreak: "break-all", maxWidth: "220px" }}>
                      {p.email}
                    </td>
                    <td style={{ color: "var(--gh-muted)", whiteSpace: "nowrap" }}>{p.phone || "N/A"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {p.gender || "N/A"} / {p.age ? `${p.age} yrs` : "N/A"}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Badge status={p.isWalkIn ? "Walk-in" : "Scheduled"} />
                    </td>
                    <td style={{ textAlign: "right", color: "var(--gh-muted)", whiteSpace: "nowrap" }}>
                      {p.createdAt ? formatDate(p.createdAt) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}