import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Toggles & State for Create vs Edit
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Holds the user being edited

  // Form states
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

  // 1. Handle Create Submit
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

  // 2. Open Edit Form and populate fields
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowCreateForm(false); // Close create form if open
  };

  // 3. Handle Update Submit
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

  // 4. Archive User (Soft-delete)
  const handleArchiveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to archive this user account?")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to archive user.");
    }
  };

  if (loading) return <div>Loading user records...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>User & Account Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button 
        onClick={() => { setShowCreateForm(!showCreateForm); setEditingUser(null); }} 
        style={{ marginBottom: "15px", padding: "8px 15px", cursor: "pointer" }}
      >
        {showCreateForm ? "Cancel" : "+ Add New User"}
      </button>

      {/* Create User Form */}
      {showCreateForm && !editingUser && (
        <form onSubmit={handleCreateSubmit} style={{ background: "#f9f9f9", padding: "15px", marginBottom: "20px", border: "1px solid #ccc" }}>
          <h3>Create New User</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label><br />
            <input 
              type="text" 
              value={createData.name} 
              onChange={(e) => setCreateData({ ...createData, name: e.target.value })} 
              required 
              style={{ width: "100%", padding: "6px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label><br />
            <input 
              type="email" 
              value={createData.email} 
              onChange={(e) => setCreateData({ ...createData, email: e.target.value })} 
              required 
              style={{ width: "100%", padding: "6px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Password:</label><br />
            <input 
              type="password" 
              value={createData.password} 
              onChange={(e) => setCreateData({ ...createData, password: e.target.value })} 
              required 
              style={{ width: "100%", padding: "6px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Role:</label><br />
            <select 
              value={createData.role} 
              onChange={(e) => setCreateData({ ...createData, role: e.target.value })}
              style={{ width: "100%", padding: "6px" }}
            >
              <option value="patient">patient</option>
              <option value="doctor">doctor</option>
              <option value="staff">staff</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button type="submit" style={{ padding: "8px 15px", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
            Save User
          </button>
        </form>
      )}

      {/* Edit / Update User Form */}
      {editingUser && (
        <form onSubmit={handleUpdateSubmit} style={{ background: "#eef9ff", padding: "15px", marginBottom: "20px", border: "1px solid #bce8f1" }}>
          <h3>Edit User: {editingUser.name}</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label><br />
            <input 
              type="text" 
              value={editData.name} 
              onChange={(e) => setEditData({ ...editData, name: e.target.value })} 
              required 
              style={{ width: "100%", padding: "6px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label><br />
            <input 
              type="email" 
              value={editData.email} 
              onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
              required 
              style={{ width: "100%", padding: "6px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Role:</label><br />
            <select 
              value={editData.role} 
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              style={{ width: "100%", padding: "6px" }}
            >
              <option value="patient">patient</option>
              <option value="doctor">doctor</option>
              <option value="staff">staff</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button type="submit" style={{ padding: "8px 15px", background: "#007bff", color: "white", border: "none", cursor: "pointer", marginRight: "10px" }}>
            Update User
          </button>
          <button type="button" onClick={() => setEditingUser(null)} style={{ padding: "8px 15px", cursor: "pointer" }}>
            Cancel
          </button>
        </form>
      )}

      {/* Users Table */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><strong>{u.role}</strong></td>
              <td>
                <button 
                  onClick={() => handleEditClick(u)} 
                  style={{ marginRight: "8px", color: "blue", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleArchiveUser(u._id)} 
                  style={{ color: "orange", cursor: "pointer" }}
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No active users registered.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}