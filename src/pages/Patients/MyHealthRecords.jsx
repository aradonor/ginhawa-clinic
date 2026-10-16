import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import { formatDate } from "../../utils/format";

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

  if (loading) return <Loading text="Loading your health records…" />;

  return (
    <div className="pt">
      <p className="pt-lead">Notes and diagnoses from your visits, written by your doctors.</p>
      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {records.length === 0 ? (
        <EmptyState
          icon="file"
          title="No health records yet"
          text="After a consultation, your doctor's notes and diagnosis will appear here."
        />
      ) : (
        <ul className="pt-list">
          {records.map((rec) => {
            const date = rec.date || (rec.createdAt ? rec.createdAt.split("T")[0] : "");
            return (
              <li key={rec._id || rec.id} className="ui-card pt-record">
                <div className="pt-record__head">
                  <div>
                    <h2 className="pt-record__title">{rec.diagnosis || "Consultation"}</h2>
                    <p className="pt-record__meta">
                      <span><Icon name="calendar" size={15} />{date ? formatDate(date) : "N/A"}</span>
                      <span><Icon name="user" size={15} />{rec.doctorName || rec.doctor?.name || "Dr. Garcia"}</span>
                    </p>
                  </div>
                </div>
                <p className="pt-record__notes">{rec.notes || rec.treatmentPlan || "No additional notes."}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
