import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Loading from "../../components/ui/Loading";
import Icon from "../../components/ui/Icon";
import { peso, formatDate } from "../../utils/format";

export default function AddPrescription() {
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    medication: "",
    quantity: 1,
    dosage: "",
    instructions: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, invRes] = await Promise.all([
          API.get("/doctor/appointments"),
          API.get("/inventory"),
        ]);
        setAppointments(appRes.data);
        setInventory(invRes.data);
      } catch (err) {
        setError("Failed to load patient appointments or pharmacy inventory");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await API.post("/doctor/prescriptions", formData);
      setSuccess("Prescription issued! Inventory deducted and added to patient billing.");
      setFormData({
        patientId: "",
        medication: "",
        quantity: 1,
        dosage: "",
        instructions: "",
      });

      const updatedInv = await API.get("/inventory");
      setInventory(updatedInv.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue prescription");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading clinic inventory & patients…" />;

  // Selected item details for calculation
  const selectedInventoryItem = inventory.find(
    (i) => (i.itemName || i.name) === formData.medication
  );
  const unitPrice = selectedInventoryItem?.unitPrice || 0;
  const totalPrice = unitPrice * (parseInt(formData.quantity, 10) || 1);

  const selectedApp = appointments.find((app) => {
    const patientObj = typeof app.patient === "object" ? app.patient : null;
    const pId = patientObj?._id || app.patient || app.patientId;
    return pId === formData.patientId;
  });

  const selectedPatientName = selectedApp
    ? (typeof selectedApp.patient === "object" ? selectedApp.patient.name : selectedApp.patientName) || "Patient"
    : null;

  return (
    <div className="pt">
      <p className="pt-lead">Issue e-prescriptions directly linked to pharmacy inventory and billing.</p>

      <div className="pt-book">
        <form className="ui-card ui-stack" onSubmit={handleSubmit}>
          {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}
          {success && <p className="ui-alert ui-alert--success" role="status">{success}</p>}

          <div className="ui-field">
            <label htmlFor="patientId">Select Patient</label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a patient</option>
              {appointments.map((app) => {
                const patientObj = typeof app.patient === "object" ? app.patient : null;
                const pName = patientObj?.name || app.patientName || "Patient";
                const pId = patientObj?._id || app.patient || app.patientId;
                return (
                  <option key={app._id} value={pId}>
                    {pName} ({app.date ? formatDate(app.date) : "Scheduled"})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="ui-field">
            <label htmlFor="medication">Medicine from Inventory</label>
            <select
              id="medication"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              required
            >
              <option value="">Choose item</option>
              {inventory.map((item) => {
                const name = item.itemName || item.name;
                const stock = item.stockQuantity !== undefined ? item.stockQuantity : item.stock;
                const price = item.unitPrice || 0;

                return (
                  <option key={item._id} value={name} disabled={stock <= 0}>
                    {name} (Stock: {stock}) — {peso(price)}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="pt-two">
            <div className="ui-field">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="ui-field">
              <label htmlFor="dosage">Dosage</label>
              <input
                id="dosage"
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g. 500mg, 1 tab 3x daily"
                required
              />
            </div>
          </div>

          <div className="ui-field">
            <label htmlFor="instructions">Instructions & Intake Schedule</label>
            <input
              id="instructions"
              type="text"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g. Take after meals for 7 days"
              required
            />
          </div>

          <button type="submit" className="ui-btn ui-btn--primary ui-btn--block" disabled={submitting}>
            <Icon name="pill" size={18} />
            {submitting ? "Processing Rx…" : "Issue Prescription & Bill Patient"}
          </button>
        </form>

        {/* Prescription Summary */}
        <aside className="ui-card pt-summary" aria-label="Prescription summary">
          <h2>Rx Summary</h2>
          <dl>
            <div>
              <dt>Patient</dt>
              <dd>{selectedPatientName || "Not chosen"}</dd>
            </div>
            <div>
              <dt>Medicine</dt>
              <dd>{formData.medication || "Not chosen"}</dd>
            </div>
            <div>
              <dt>Quantity</dt>
              <dd>{formData.quantity || 1}</dd>
            </div>
            <div>
              <dt>Dosage</dt>
              <dd>{formData.dosage || "—"}</dd>
            </div>
            <div className="pt-summary__total">
              <dt>Medication Cost</dt>
              <dd>{peso(totalPrice)}</dd>
            </div>
          </dl>
          <p className="pt-summary__note">
            Submitting auto-deducts pharmacy stock and attaches the total amount directly to the patient's billing statement.
          </p>
        </aside>
      </div>
    </div>
  );
}