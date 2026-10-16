import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Icon from "../../components/ui/Icon";
import Loading from "../../components/ui/Loading";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [createData, setCreateData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "patient",
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load system users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/users", createData);
      setCreateData({ name: "", email: "", password: "", role: "patient" });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user.");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowCreateForm(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/users/${editingUser._id}`, editData);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user.");
    }
  };

  const handleArchiveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to archive this user account?")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to archive user.");
    }
  };

  if (loading) return <Loading text="Loading user directory…" />;

  return (
    <div className="pt">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <p className="pt-lead" style={{ margin: 0 }}>Create, update role permissions, or archive system user accounts.</p>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingUser(null);
          }}
          className="ui-btn ui-btn--primary ui-btn--sm"
        >
          <Icon name="plus" size={16} /> {showCreateForm ? "Cancel" : "Add New User"}
        </button>
      </div>

      {error && <p className="ui-alert ui-alert--error" role="alert">{error}</p>}

      {/* Create User Form Card */}
      {showCreateForm && !editingUser && (
        <form onSubmit={handleCreateSubmit} className="ui-card ui-stack">
          <h3 className="pt-section-title" style={{ margin: 0 }}>Register New User Account</h3>
          
          <div className="pt-two">
            <div className="ui-field">
              <label>Full Name</label>
              <input
                type="text"
                value={createData.name}
                onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                required
              />
            </div>
            <div className="ui-field">
              <label>Email Address</label>
              <input
                type="email"
                value={createData.email}
                onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="pt-two">
            <div className="ui-field">
              <label>Password</label>
              <input
                type="password"
                value={createData.password}
                onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                required
              />
            </div>
            <div className="ui-field">
              <label>Assign Portal Role</label>
              <select
                value={createData.role}
                onChange={(e) => setCreateData({ ...createData, role: e.target.value })}
              >
                <option value="patient">patient</option>
                <option value="doctor">doctor</option>
                <option value="staff">staff</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

          <button type="submit" className="ui-btn ui-btn--primary">
            <Icon name="check" size={16} /> Save User Account
          </button>
        </form>
      )}

      {/* Edit User Form Card */}
      {editingUser && (
        <form onSubmit={handleUpdateSubmit} className="ui-card ui-stack" style={{ borderColor: "var(--gh-blue)" }}>
          <h3 className="pt-section-title" style={{ margin: 0 }}>Edit Account: {editingUser.name}</h3>

          <div className="pt-two">
            <div className="ui-field">
              <label>Full Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                required
              />
            </div>
            <div className="ui-field">
              <label>Email Address</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="ui-field">
            <label>Portal Role</label>
            <select
              value={editData.role}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
            >
              <option value="patient">patient</option>
              <option value="doctor">doctor</option>
              <option value="staff">staff</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="ui-btn ui-btn--primary">
              Update Account
            </button>
            <button type="button" onClick={() => setEditingUser(null)} className="ui-btn ui-btn--ghost">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users List Table */}
      {users.length === 0 ? (
        <EmptyState
          icon="users"
          title="No users found"
          text="No active user accounts were found in the system database."
        />
      ) : (
        <div className="ui-card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
            <thead>
              <tr style={{ background: "var(--gh-soft)", borderBottom: "1px solid var(--gh-border)", textAlign: "left" }}>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Name</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Email</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>Role</th>
                <th style={{ padding: "0.9rem 1.25rem", fontWeight: "600", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid var(--gh-border)" }}>
                  <td style={{ padding: "0.9rem 1.25rem", fontWeight: "600" }}>{u.name}</td>
                  <td style={{ padding: "0.9rem 1.25rem", color: "var(--gh-muted)" }}>{u.email}</td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <Badge status={u.role || "patient"} />
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEditClick(u)}
                        className="ui-btn ui-btn--ghost ui-btn--sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchiveUser(u._id)}
                        className="ui-btn ui-btn--danger ui-btn--sm"
                      >
                        Archive
                      </button>
                    </div>
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