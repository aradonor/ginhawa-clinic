import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Loading from "../../components/ui/Loading";
import { formatDate } from "../../utils/format";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/audit-logs")
      .then((res) => setLogs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading system audit security logs…" />;

  return (
    <div className="pt">
      <p className="pt-lead">Track user activities, authentication attempts, and system events for security and compliance.</p>

      {logs.length === 0 ? (
        <EmptyState
          icon="lock"
          title="No audit logs recorded"
          text="System events and user activity logs will appear here in chronological order."
        />
      ) : (
        <div className="ui-card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
            <thead>
              <tr style={{ background: "var(--gh-soft)", borderBottom: "1px solid var(--gh-border)", textAlign: "left" }}>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Timestamp</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>User / Role</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Action</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: "1px solid var(--gh-border)" }}>
                  <td style={{ padding: "0.9rem 1.25rem", color: "var(--gh-muted)", whiteSpace: "nowrap" }}>
                    {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <div style={{ fontWeight: "600" }}>{log.user?.name || "System"}</div>
                    <Badge status={log.user?.role || "admin"} />
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>
                    {log.action}
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", color: "var(--gh-muted)" }}>
                    {log.details || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}