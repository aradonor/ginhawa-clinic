import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";
import { formatDate } from "../../utils/format";

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

  if (loading) return <Loading text="Loading your prescriptions…" />;

  return (
    <div className="pt">
      <p className="pt-lead">The medicines your doctor prescribed, with how to take them.</p>
      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {prescriptions.length === 0 ? (
        <EmptyState
          icon="pill"
          title="No prescriptions yet"
          text="When a doctor prescribes medicine, it will be listed here."
        />
      ) : (
        <ul className="pt-list">
          {prescriptions.map((p) => {
            const dateVal = p.date || p.createdAt?.split("T")[0] || "";
            const docName = p.doctorName || p.doctor?.name || "Attending Physician";

            // A prescription uses either a medicines array or root-level fields
            const medsList =
              p.medicines && p.medicines.length > 0
                ? p.medicines.map((med) => ({
                    name: med.medication || med.name || med.itemName || "N/A",
                    dosage: med.dosage || med.dose || "",
                    instructions: med.instructions || med.note || "",
                  }))
                : [
                    {
                      name: p.medication || p.medicineName || "No medicines listed",
                      dosage: p.dosage || "",
                      instructions: p.instructions || "",
                    },
                  ];

            return (
              <li key={p._id} className="ui-card pt-record">
                <div className="pt-record__head">
                  <div>
                    <h2 className="pt-record__title">Prescribed by {docName}</h2>
                    <p className="pt-record__meta">
                      <span><Icon name="calendar" size={15} />{dateVal ? formatDate(dateVal) : "N/A"}</span>
                    </p>
                  </div>
                </div>
                <ul className="pt-meds">
                  {medsList.map((med, index) => (
                    <li key={`${p._id}-${index}`} className="pt-med">
                      <div className="pt-med__top">
                        <span className="pt-med__name">{med.name}</span>
                        {med.dosage && <span className="pt-med__dose">{med.dosage}</span>}
                      </div>
                      {med.instructions && <p className="pt-med__note">{med.instructions}</p>}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
