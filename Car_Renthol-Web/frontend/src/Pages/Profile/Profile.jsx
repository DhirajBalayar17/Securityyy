import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from local storage
    const storedUser = {
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      phone: localStorage.getItem("phone"), // ✅ New field
      userId: localStorage.getItem("userId"),
    };

    if (!storedUser.username) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (!user) return <p className="text-center text-lg">Loading profile...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white font-[Poppins]">
      <div className="w-[520px] p-10 rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
          Your Profile
        </h2>

        <div className="space-y-6 text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
            <strong>Email:</strong> {user.email || "Not Available"}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
            <strong>Phone:</strong> {user.phone || "Not Available"}
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={() => navigate(`/edit-profile/${user.userId}`)}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-500 transition-all"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold shadow-lg hover:bg-red-500 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
