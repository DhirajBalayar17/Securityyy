import { useState, useEffect } from "react";
import axios from "axios";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found. Admin must log in.");
          setError("Unauthorized access. Please log in.");
          return;
        }
        
        const response = await axios.get("https://localhost:3000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("📌 API Response for Bookings:", response.data);
        setBookings(response.data);
      } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Delete Booking
  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await axios.delete(`https://localhost:3000/api/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id));
      console.log(`✅ Booking with ID ${id} deleted`);
    } catch (error) {
      console.error("❌ Error deleting booking:", error);
    }
  };

  // ✅ Approve or Reject Booking
  const updateBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`https://localhost:3000/api/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.map((booking) =>
        booking._id === id ? { ...booking, status } : booking
      ));
      console.log(`✅ Booking ID ${id} status updated to ${status}`);
    } catch (error) {
      console.error("❌ Error updating booking status:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Bookings</h2>
      
      {loading && <p className="text-gray-600 text-center">Loading bookings...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Vehicle</th>
                <th className="p-3 border">Dates</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-700">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="text-center border hover:bg-gray-100 text-black">
                    <td className="p-3 border">{booking.userId?.email || "Unknown"}</td>
                    <td className="p-3 border">{booking.userId?.phone || "N/A"}</td>
                    <td className="p-3 border">
                      {booking.vehicleId ? `${booking.vehicleId.brand} - ${booking.vehicleId.name}` : "No Vehicle Data"}
                    </td>
                    <td className="p-3 border">
                      {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "N/A"} - 
                      {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-3 border">Rs {booking.totalAmount || "0.00"}</td>
                    <td className={`p-3 border font-semibold ${
                      booking.status === "pending" ? "text-yellow-500" : 
                      booking.status === "confirmed" ? "text-green-500" : 
                      booking.status === "canceled" ? "text-red-500" : "text-gray-500"}`}>{booking.status}</td>
                    <td className="p-3 border">
                      {booking.status === "pending" ? (
                        <>
                          <button 
                            className="text-green-500 hover:text-green-700 transition duration-200 mr-3" 
                            onClick={() => updateBookingStatus(booking._id, "confirmed")}
                          >
                            ✅ Approve
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 transition duration-200" 
                            onClick={() => updateBookingStatus(booking._id, "canceled")}
                          >
                            ❌ Reject
                          </button>
                        </>
                      ) : (
                        booking.status
                      )}
                      <button 
                        className="text-red-500 hover:text-red-700 transition duration-200 ml-3" 
                        onClick={() => deleteBooking(booking._id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
