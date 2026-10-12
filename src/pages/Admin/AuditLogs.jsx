import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get("/admin/audit-logs").then((res) => setLogs(res.data)).catch(() => {});
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>System Audit Logs</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.user?.name || "System"} ({log.user?.role})</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
            </tr>
          ))}
          {logs.length === 0 && <tr><td colSpan="4" style={{ textAlign: "center" }}>No logs recorded.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}