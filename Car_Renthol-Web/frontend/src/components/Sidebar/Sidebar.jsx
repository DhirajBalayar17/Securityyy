import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    FiUsers, FiTruck, FiHome, FiLogOut, FiClipboard, FiDollarSign, FiFileText, FiPlusCircle
} from "react-icons/fi"; 

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <aside className="w-64 h-screen fixed top-0 left-0 bg-gray-900 text-white p-5 flex flex-col">
            {/* ✅ Admin Panel Header */}
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FiHome size={24} />
                Admin Panel
            </h2>

            {/* ✅ Sidebar Navigation */}
            <nav className="flex-grow">
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/admin"
                            className={`flex items-center gap-3 p-3 rounded-lg transition ${
                                location.pathname === "/admin" ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                        >
                            <FiHome size={20} /> Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/manage-users"
                            className={`flex items-center gap-3 p-3 rounded-lg transition ${
                                location.pathname.includes("/admin/manage-users") ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                        >
                            <FiUsers size={20} /> Manage Users
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/manage-cars"
                            className={`flex items-center gap-3 p-3 rounded-lg transition ${
                                location.pathname.includes("/admin/manage-cars") ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                        >
                            <FiTruck size={20} /> Manage Cars
                        </Link>
                    </li>

                    {/* ✅ New Add Vehicle Option (Only Addition) */}
                    <li>
                        <Link
                            to="/admin/add-vehicle"
                            className={`flex items-center gap-3 p-3 rounded-lg transition ${
                                location.pathname.includes("/admin/add-vehicle") ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                        >
                            <FiPlusCircle size={20} /> Add Vehicle
                        </Link>
                    </li>

                    {/* ✅ Manage Bookings */}
                    <li>
                        <Link
                            to="/admin/manage-bookings"
                            className={`flex items-center gap-3 p-3 rounded-lg transition ${
                                location.pathname.includes("/admin/manage-bookings") ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                        >
                            <FiClipboard size={20} /> Manage Bookings
                        </Link>
                    </li>

                </ul>
            </nav>

            {/* ✅ Logout Button */}
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 p-3 rounded-lg flex items-center gap-3 transition mt-auto"
            >
                <FiLogOut size={20} /> Logout
            </button>
        </aside>
    );
};

export default Sidebar;
