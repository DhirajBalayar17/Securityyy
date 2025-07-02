import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // ✅ Fixed: Renamed `contact` to `phone`
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Fetch vehicle details
    axios
      .get(`https://localhost:3000/api/vehicles/${id}`)
      .then((response) => {
        console.log("🚀 Vehicle Data:", response.data);
        setVehicle(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching vehicle details:", error);
        setLoading(false);
      });

    // ✅ Fetch logged-in user details
    const storedName = localStorage.getItem("username");
    const storedPhone = localStorage.getItem("phone");

    if (storedName) setName(storedName);
    if (storedPhone) setPhone(storedPhone);
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24))); // Ensure at least 1 day
      setTotalAmount(days * (vehicle?.pricePerDay || 0)); // Handle undefined vehicle
    }
  }, [startDate, endDate, vehicle]);

  // ✅ Handles the booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !startDate || !endDate) {
      alert("⚠ Please fill in all fields.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("🚨 User not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    const bookingData = {
      userId,
      vehicleId: vehicle._id,
      startDate,
      endDate,
      totalAmount,
      paymentMethod,
      phone, // ✅ Fixed: Now sending `phone` instead of `contact`
      bookingDate: new Date().toISOString(),
      status: "pending",
    };

    console.log("📌 Sending Booking Data:", bookingData); // ✅ Log before sending

    try {
      const response = await axios.post(
        "https://localhost:3000/api/bookings",
        bookingData
      );
      console.log("✅ Booking Response:", response.data);

      alert("✅ Booking Confirmed! Redirecting...");
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (error) {
      console.error("❌ Error submitting booking:", error.response?.data || error.message);
      alert(`❌ Booking failed. Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        {/* 🚀 Loading State */}
        {loading ? (
          <p className="text-center text-xl font-semibold text-gray-600 dark:text-white">
            Loading vehicle details...
          </p>
        ) : vehicle ? (
          <>
            {/* Title */}
            <h2 className="text-center text-3xl font-bold text-primary mb-6 flex items-center justify-center">
              🚗 Book <span className="text-yellow-500 ml-2">{vehicle.name || "Vehicle"}</span>
            </h2>

            {/* Vehicle Image */}
            <div className="flex justify-center mb-6">
              <img
                src={vehicle.imageUrl || "/default-car.png"}
                alt={vehicle.name || "Car"}
                className="w-64 h-40 object-cover rounded-lg"
                onError={(e) => (e.target.src = "/default-car.png")}
              />
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-lg mb-2 flex items-center">
                  <FaUser className="mr-2 text-black dark:text-white" /> Full Name:
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-lg mb-2 flex items-center">
                  <FaPhone className="mr-2 text-black dark:text-white" /> Phone Number:
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-lg mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-black dark:text-white" /> Start Date:
                </label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-lg mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-black dark:text-white" /> End Date:
                </label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              {/* Total Amount */}
              <p className="text-lg font-semibold text-yellow-500 flex items-center">
                <FaMoneyBillWave className="mr-2" /> Total Amount:
                <span className="text-black dark:text-white ml-2">Rs {totalAmount}</span>
              </p>

              {/* Buttons */}
              <div className="col-span-1 md:col-span-2 flex gap-4 mt-6">
                <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
                  ✅ Confirm Booking
                </button>
                <button type="button" className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition" onClick={() => navigate(-1)}>
                  ❌ Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-center text-xl font-semibold text-red-500">
            🚨 Error: Vehicle not found.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
