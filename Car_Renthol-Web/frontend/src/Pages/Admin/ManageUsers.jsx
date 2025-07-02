import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FiEdit, FiTrash } from "react-icons/fi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ Unauthorized! Please log in again.");
        window.location.href = "/login";
        return;
      }

      const response = await axios.get("https://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.users.length > 0) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
        setError("No users found.");
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error.response?.data || error.message);
      setError("Error fetching users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://localhost:3000/api/admin/users/${editingUser._id}`,
        editingUser, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(users.map((user) => (user._id === editingUser._id ? { ...user, ...editingUser } : user)));
      alert("✅ User updated successfully!");
      handleModalClose();
    } catch (error) {
      console.error("❌ Error updating user:", error.response?.data || error.message);
      alert("❌ Error updating user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:3000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== userId));
      alert("✅ User deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting user:", error.response?.data || error.message);
      alert("❌ Error deleting user. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Users</h1>

        <div className="bg-white p-6 shadow rounded-lg">
          {loading ? (
            <p className="text-gray-500 text-center">🔄 Loading users...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-4">No.</th>
                  <th className="border p-4">Name</th>
                  <th className="border p-4">Email</th>
                  <th className="border p-4">Phone</th>
                  <th className="border p-4">Role</th>
                  <th className="border p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id} className="border">
                      <td className="border p-4">{index + 1}</td>
                      <td className="border p-4">{user.username}</td>
                      <td className="border p-4">{user.email}</td>
                      <td className="border p-4">{user.phone || "N/A"}</td>
                      <td className="border p-4">
                        {user.role === "admin" ? (
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            User
                          </span>
                        )}
                      </td>
                      <td className="border p-4 flex justify-center gap-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-500 hover:text-blue-700 transition duration-200"
                        >
                          <FiEdit size={20} />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            className="text-red-500 hover:text-red-700 transition duration-200"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <FiTrash size={20} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 p-4">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUserUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={editingUser?.username || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full p-3 mt-1 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editingUser?.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-3 mt-1 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={editingUser?.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full p-3 mt-1 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={editingUser?.role || "user"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full p-3 mt-1 border rounded-lg"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-between mt-6">
                <button type="submit" className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                <button type="button" onClick={handleModalClose} className="py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
