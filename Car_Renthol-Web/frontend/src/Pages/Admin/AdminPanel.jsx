// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FiEdit, FiTrash } from "react-icons/fi";

// const AdminPanel = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const response = await axios.get("http://localhost:3000/api/users/");
//             setUsers(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error("❌ Error fetching users:", error.message);
//             setError("Failed to load users.");
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (userId) => {
//         if (!window.confirm("Are you sure you want to delete this user?")) return;

//         try {
//             await axios.delete(`http://localhost:3000/api/users/${userId}`);
//             setUsers(users.filter((user) => user._id !== userId));
//         } catch (error) {
//             console.error("❌ Error deleting user:", error.message);
//             alert("Failed to delete user. Please try again.");
//         }
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Users</h1>

//             {loading ? (
//                 <p className="text-center text-gray-600">Loading users...</p>
//             ) : error ? (
//                 <p className="text-center text-red-600">{error}</p>
//             ) : (
//                 <div className="bg-white p-6 shadow rounded-lg overflow-x-auto">
//                     <table className="w-full border-collapse">
//                         <thead>
//                             <tr className="bg-gray-800 text-white text-left">
//                                 <th className="border p-4">No.</th>
//                                 <th className="border p-4">Name</th>
//                                 <th className="border p-4">Email</th>
//                                 <th className="border p-4">Role</th>
//                                 <th className="border p-4 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((user, index) => (
//                                 <tr key={user._id} className="border hover:bg-gray-100">
//                                     <td className="border p-4">{index + 1}</td>
//                                     <td className="border p-4">{user.username}</td>
//                                     <td className="border p-4">{user.email}</td>
//                                     <td className="border p-4">
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                                                 user.role === "admin" ? "bg-red-500 text-white" : "bg-green-500 text-white"
//                                             }`}
//                                         >
//                                             {user.role === "admin" ? "Admin" : "User"}
//                                         </span>
//                                     </td>
//                                     <td className="border p-4 flex justify-center gap-3">
//                                         <button className="text-blue-500 hover:text-blue-700 transition duration-200">
//                                             <FiEdit size={20} />
//                                         </button>
//                                         <button
//                                             className="text-red-500 hover:text-red-700 transition duration-200"
//                                             onClick={() => handleDelete(user._id)}
//                                         >
//                                             <FiTrash size={20} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminPanel;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash } from "react-icons/fi";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("❌ No token found. Redirecting to login.");
                alert("Unauthorized! Please log in again.");
                window.location.href = "/login";
                return;
            }

            console.log("🔍 Token being sent:", token);

            const response = await axios.get("https://localhost:3000/api/users/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            console.log("✅ Users API Response:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("❌ Error fetching users:", error.response?.data || error.message);
            setError("Failed to load users. Please check the console.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(`https://localhost:3000/api/users/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            setUsers(users.filter((user) => user._id !== userId));
            console.log(`✅ User with ID ${userId} deleted successfully.`);
        } catch (error) {
            console.error("❌ Error deleting user:", error.response?.data || error.message);
            alert("Failed to delete user. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Users</h1>

            {loading ? (
                <p className="text-center text-gray-600">🔄 Loading users...</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : (
                <div className="bg-white p-6 shadow rounded-lg overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white text-left">
                                <th className="border p-4">No.</th>
                                <th className="border p-4">Name</th>
                                <th className="border p-4">Email</th>
                                <th className="border p-4">Role</th>
                                <th className="border p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id} className="border hover:bg-gray-100 transition duration-200">
                                    <td className="border p-4">{index + 1}</td>
                                    <td className="border p-4">{user.username}</td>
                                    <td className="border p-4">{user.email}</td>
                                    <td className="border p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-200 ${
                                                user.role === "admin" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                                            }`}
                                        >
                                            {user.role === "admin" ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="border p-4 flex justify-center gap-3">
                                        <button className="text-blue-500 hover:text-blue-700 transition duration-200">
                                            <FiEdit size={20} />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 transition duration-200"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <FiTrash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
