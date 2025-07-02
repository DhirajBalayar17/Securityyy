import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchUserBookings = async () => {
      try {
        console.log(`📌 API Called: GET /api/bookings/user/${userId}`);
        const response = await axios.get(`https://localhost:3000/api/bookings/user/${userId}`);
        setBookings(response.data.length ? response.data : []);
        if (response.data.length === 0) setError("You have no bookings yet.");
      } catch (err) {
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []); // ✅ FIX: Removed navigate from dependency array to prevent re-fetching.

  // Filtering bookings based on status
  const filteredBookings = sortBy ? bookings.filter(booking => booking.status === sortBy) : bookings;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 text-gray-900 p-6 font-sans">
      
      {/* Top Bar: Title and Sort Dropdown */}
      <div className="w-full max-w-7xl flex justify-between items-center mt-24 mb-6 px-4">
        <h2 className="text-4xl font-bold text-blue-700 drop-shadow-md">My Bookings</h2>
        <div className="relative w-56">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-3 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
          >
            <option value="">Sort by</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Canceled</option>
          </select>
          {/* Custom Arrow Icon (Inside Dropdown) */}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            ▼
          </div>
        </div>
      </div>

      {loading && <p className="text-gray-600 text-lg animate-pulse">Loading your bookings...</p>}
      {!loading && error && <p className="text-red-500 text-lg font-semibold">{error}</p>}

      {!loading && !error && filteredBookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                {booking.vehicleId?.brand} - {booking.vehicleId?.name}
              </h3>

              {/* Booking Status */}
              <div
                className={`p-2 text-white text-center rounded-lg font-semibold mb-4 ${
                  booking.status === "pending" ? "bg-yellow-500" 
                  : booking.status === "confirmed" ? "bg-green-500" 
                  : "bg-red-500"
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>

              <div className="space-y-2 text-sm text-gray-700 font-medium">
                <p><strong>Phone:</strong> {booking.userId?.phone || "Not Available"}</p>
                <p><strong>Date:</strong> {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}</p>
                <p><strong>Amount:</strong> Rs {booking.totalAmount}</p>
                <p><strong>Payment Type:</strong> {booking.paymentMethod}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show Message if No Bookings Available */}
      {!loading && !error && filteredBookings.length === 0 && (
        <p className="text-gray-600 text-lg">No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookings;
