import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [availableVehicles, setAvailableVehicles] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [pendingBookings, setPendingBookings] = useState(0);
    const [confirmedBookings, setConfirmedBookings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("❌ No token found. Redirecting to login.");
                alert("Unauthorized! Please log in again.");
                window.location.href = "/login";
                return;
            }

            console.log("🔍 Token being sent:", token);

            // Fetch data in parallel
            const [usersRes, vehiclesRes, bookingsRes] = await Promise.all([
                axios.get("https://localhost:3000/api/users/", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("https://localhost:3000/api/vehicles/", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("https://localhost:3000/api/bookings/", { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            // Process User Data
            const users = usersRes.data;
            setTotalUsers(users.length);
            setTotalAdmins(users.filter(user => user.role === "admin").length);

            // Process Vehicle Data
            const vehicles = vehiclesRes.data;
            setTotalVehicles(vehicles.length);
            setAvailableVehicles(vehicles.filter(vehicle => vehicle.available).length);

            // Process Booking Data
            const bookings = bookingsRes.data;
            setTotalBookings(bookings.length);
            setPendingBookings(bookings.filter(booking => booking.status === "pending").length);
            setConfirmedBookings(bookings.filter(booking => booking.status === "confirmed").length);

            setLoading(false);
        } catch (error) {
            console.error("❌ Error fetching dashboard data:", error.response?.data || error.message);
            setError("Failed to load dashboard data.");
            setLoading(false);
        }
    };

    // Data for Bar Chart (Users, Vehicles, and Bookings)
    const barData = [
        { name: "Users", total: totalUsers, admins: totalAdmins },
        { name: "Vehicles", total: totalVehicles, available: availableVehicles },
        { name: "Bookings", total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings },
    ];

    // Data for Pie Chart (Booking Status)
    const pieData = [
        { name: "Pending", value: pendingBookings },
        { name: "Confirmed", value: confirmedBookings },
    ];

    const COLORS = ["#FFBB28", "#00C49F"];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

            {loading ? (
                <p className="text-gray-600 text-center">🔄 Loading dashboard data...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <>
                    {/* Summary Boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 shadow-md rounded-lg text-center">
                            <h3 className="text-xl font-semibold text-gray-700">👥 Total Users</h3>
                            <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                        </div>
                        <div className="bg-white p-6 shadow-md rounded-lg text-center">
                            <h3 className="text-xl font-semibold text-gray-700">🛠 Total Admins</h3>
                            <p className="text-3xl font-bold text-gray-800">{totalAdmins}</p>
                        </div>
                        <div className="bg-white p-6 shadow-md rounded-lg text-center">
                            <h3 className="text-xl font-semibold text-gray-700">🚗 Total Vehicles</h3>
                            <p className="text-3xl font-bold text-purple-600">{totalVehicles}</p>
                        </div>
                        <div className="bg-white p-6 shadow-md rounded-lg text-center">
                            <h3 className="text-xl font-semibold text-gray-700">✅ Available Vehicles</h3>
                            <p className="text-3xl font-bold text-green-600">{availableVehicles}</p>
                        </div>
                        <div className="bg-white p-6 shadow-md rounded-lg text-center">
                            <h3 className="text-xl font-semibold text-gray-700">📦 Total Bookings</h3>
                            <p className="text-3xl font-bold text-indigo-600">{totalBookings}</p>
                        </div>
                        <div className="bg-white p-6 shadow-md rounded-lg text-center">
                            <h3 className="text-xl font-semibold text-gray-700">⏳ Pending Bookings</h3>
                            <p className="text-3xl font-bold text-yellow-500">{pendingBookings}</p>
                        </div>
                        <div className="bg-white p-6 shadow-md rounded-lg text-center">
                            <h3 className="text-xl font-semibold text-gray-700">✅ Confirmed Bookings</h3>
                            <p className="text-3xl font-bold text-green-500">{confirmedBookings}</p>
                        </div>
                    </div>

                    {/* Graphs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="bg-white p-6 shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">📊 Statistics</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total" fill="#8884d8" name="Total" />
                                    <Bar dataKey="admins" fill="#82ca9d" name="Admins" />
                                    <Bar dataKey="available" fill="#00C49F" name="Available Vehicles" />
                                    <Bar dataKey="pending" fill="#FFBB28" name="Pending Bookings" />
                                    <Bar dataKey="confirmed" fill="#0088FE" name="Confirmed Bookings" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-white p-6 shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">📦 Booking Status</h3>
                      <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={pieData}
      dataKey="value"
      cx="50%"
      cy="50%"
      outerRadius={80}
      fill="#8884d8"
      label
    >
      {pieData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
