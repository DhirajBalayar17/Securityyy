import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    // Fetch car details by ID
    axios.get(`https://localhost:3000/api/vehicles/${id}`)
      .then(response => {
        setCar(response.data);
      })
      .catch(error => {
        console.error("Error fetching car:", error);
      });
  }, [id]);

  const handleSave = async () => {
    try {
      // Send updated car data to the server
      await axios.put(`https://localhost:3000/api/vehicles/${id}`, car);
      navigate("/admin/manage-cars"); // Redirect after saving
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Edit Vehicle</h2>
      {car ? (
        <div>
          <div>
            <label className="block mb-2">Car Name</label>
            <input
              type="text"
              name="name"
              value={car.name}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Price/Day</label>
            <input
              type="number"
              name="pricePerDay"
              value={car.pricePerDay}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={car.brand}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Availability</label>
            <select
              name="available"
              value={car.available}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded"
            >
              <option value={true}>Available</option>
              <option value={false}>Not Available</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-6 rounded"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <p>Loading car details...</p>
      )}
    </div>
  );
};

export default EditVehicle;
