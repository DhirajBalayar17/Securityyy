import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet, Navigate } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("token");
const getUserRole = () => localStorage.getItem("role") || "user";

const AdminLayout = () => {
    if (!isAuthenticated() || getUserRole() !== "admin") {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex">
            <Sidebar /> {/* ✅ Sidebar appears once and is fixed */}
            <main className="flex-1 p-6 bg-gray-100 min-h-screen ml-64">
                <Outlet /> {/* ✅ This will render child routes (Manage Users, Manage Cars, etc.) */}
            </main>
        </div>
    );
};

export default AdminLayout;
