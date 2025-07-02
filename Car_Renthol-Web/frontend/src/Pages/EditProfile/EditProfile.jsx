import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = ({ setUser }) => {
  const navigate = useNavigate();
  const [user, setUserData] = useState({
    id: "",
    username: "",
    email: "",
    phone: "", // ✅ Added phone number field
  });

  useEffect(() => {
    // Retrieve user details from localStorage
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedPhone = localStorage.getItem("phone"); // ✅ Added phone

    if (!storedUserId) {
      navigate("/login"); // Redirect to login if user is not logged in
    } else {
      setUserData({ id: storedUserId, username: storedUsername, email: storedEmail, phone: storedPhone });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUserData({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please log in again.");
        navigate("/login");
        return;
      }

      // ✅ Fix API Endpoint (Removed /update/)
      await axios.put(
        `https://localhost:3000/api/users/${user.id}`,
        { username: user.username, email: user.email, phone: user.phone }, // ✅ Now includes phone
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Profile Updated Successfully!");
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("phone", user.phone); // ✅ Save updated phone number
      setUser(user); // Update global state if required
      navigate("/profile");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("❌ Failed to update profile!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 dark:bg-black text-black dark:text-white">
      <div className="w-[480px] p-8 bg-white dark:bg-gray-900 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>

        <form onSubmit={handleUpdate}>
          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white font-medium">Username:</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1"
              required
            />
          </div>

          {/* Phone Input (NEW) */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white font-medium">Phone:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1"
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
              Save Changes
            </button>
            <button type="button" onClick={() => navigate("/profile")} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
