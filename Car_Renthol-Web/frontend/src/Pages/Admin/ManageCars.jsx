import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom"; // Link to Edit page

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("https://localhost:3000/api/vehicles"); // ✅ Ensure correct API endpoint
      setCars(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axios.delete(`https://localhost:3000/api/vehicles/${id}`);
      setCars((prevCars) => prevCars.filter(car => car._id !== id)); // ✅ Update state properly
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Manage Cars</h2>
      <div className="bg-white p-4 shadow rounded-lg">
        {loading ? (
          <p>Loading cars...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">No.</th>
                <th className="p-2 border">Car Name</th>
                <th className="p-2 border">Brand</th>
                <th className="p-2 border">Price/Day</th>
                <th className="p-2 border">Availability</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={car._id} className="text-center">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{car.name}</td>
                  <td className="p-2 border">{car.brand}</td>
                  <td className="p-2 border">Rs {car.pricePerDay}/Day</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded ${car.available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {car.available ? "Available" : "Rented"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <img 
                      src={`https://localhost:3000/${car.image}`} // ✅ Fixed Image Path
                      alt={car.name} 
                      className="w-16 h-16 object-cover rounded" 
                    />
                  </td>
                  <td className="p-2 border">
  <div className="flex justify-center items-center gap-2">
    {/* Edit Button */}
    <Link to={`/admin/manage-cars/edit/${car._id}`} className="text-blue-500 mx-2">
      <FaEdit />
    </Link>
    {/* Delete Button */}
    <button className="text-red-500" onClick={() => deleteCar(car._id)}>
      <FaTrash />
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCars;
