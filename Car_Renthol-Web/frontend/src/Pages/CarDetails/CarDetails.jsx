import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Import placeholder image
import fallbackImage from "../../assets/car2.png";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch car details from the backend
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:3000/api/vehicles/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error("❌ Error fetching car details:", error);
        setError("Car details not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-white">Loading car details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-6 bg-gray-900 text-white min-h-screen gap-12">
      
      {/* ✅ Car Image - Left Section */}
      <div className="flex justify-center w-full md:w-1/2">
        <img
          src={`https://localhost:3000/${car.image}`} // ✅ Ensure correct backend path
          alt={car.name}
          className="w-[90%] md:w-[100%] max-h-[400px] object-contain rounded-lg shadow-lg"
          onError={(e) => (e.target.src = fallbackImage)}
        />
      </div>

      {/* ✅ Car Details - Right Section */}
      <div className="w-full md:w-1/2 bg-gray-800 p-8 rounded-lg shadow-md text-left">
        <h2 className="text-4xl font-bold text-yellow-400 mb-4">{car.name}</h2>
        <p className="text-xl">
          <span className="font-semibold">Brand:</span> {car.brand}
        </p>
        <p className="text-xl text-yellow-400 mt-2">
          <span className="font-semibold">Price:</span> Rs {car.pricePerDay}/Day
        </p>
        <p className="text-lg mt-2">
          <span className="font-semibold">Availability:</span> {car.available ? "✅ Available" : "❌ Not Available"}
        </p>
        <p className="mt-4 text-gray-300 text-sm">{car.description}</p>

        {/* ✅ Buttons - Aligned Properly */}
        <div className="flex gap-6 mt-6">
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
            onClick={() => navigate(`/booking/${car._id}`)} // ✅ Navigates to Booking Page
          >
            Book Now
          </button>
          <button 
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition"
            onClick={() => navigate(-1)} // ✅ Go back to the previous page
          >
            Cancel
          </button>
        </div>
      </div>

    </div>
  );
};

export default CarDetails;
