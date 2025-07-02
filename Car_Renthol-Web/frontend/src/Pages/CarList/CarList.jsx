import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CarList = () => {
  const [vehicles, setVehicles] = useState([]); // ✅ Fixed: Renamed cars → vehicles
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const navigate = useNavigate();

  // 🔹 Fetch Vehicles from Backend API
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("https://localhost:3000/api/vehicles");
      console.log("🚀 API Response:", response.data); // Debugging: Log API data
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching vehicles:", error);
      setLoading(false);
    }
  };

  // 🔍 Search Filter Logic
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔽 Sorting Logic
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortOrder === "low-to-high") return a.pricePerDay - b.pricePerDay;
    if (sortOrder === "high-to-low") return b.pricePerDay - a.pricePerDay;
    return 0; // Default order (no sorting)
  });

  return (
    <div className="pb-24 bg-gray-100 dark:bg-dark text-black dark:text-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* 🔹 Heading Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-serif text-primary">
            Our Vehicle Collection
          </h1>
        </div>

        {/* 🔍 Search & Sorting Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <input
            type="text"
            placeholder="Search vehicles..."
            className="px-4 py-2 border rounded-lg focus:outline-none dark:bg-gray-800 dark:text-white w-full sm:w-[40%]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none dark:bg-gray-800 dark:text-white w-full sm:w-[30%]"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort by</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>

        {/* 🔹 Vehicle Listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
            <p className="text-center text-lg text-gray-500 dark:text-gray-300 col-span-3">
              Loading vehicles...
            </p>
          ) : sortedVehicles.length > 0 ? (
            sortedVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-500 transform hover:scale-105"
              >
                {/* ✅ Fixed Image Section */}
                <div className="w-full h-[150px] flex justify-center items-center">
                  <img
                    src={vehicle.imageUrl ? vehicle.imageUrl : "/default-car.png"} 
                    alt={vehicle.name}
                    className="w-full h-auto max-h-[150px] object-cover rounded-lg"
                    onError={(e) => (e.target.src = "/default-car.png")} // Fallback image
                  />
                </div>

                <div className="text-center mt-4 space-y-2">
                  <h2 className="text-2xl font-bold text-primary">{vehicle.name}</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Rs {vehicle.pricePerDay}/Day</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {vehicle.brand}
                  </p>
                  <button
                    className="mt-3 px-5 py-2 bg-primary text-white rounded-lg hover:bg-opacity-80 transition-all duration-300"
                    onClick={() => navigate(`/car/${vehicle._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-500 dark:text-gray-300 col-span-3">
              No vehicles found matching your search.
            </p>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12">
          <button className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarList;
