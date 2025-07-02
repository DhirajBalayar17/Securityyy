import React, { useState } from "react";
import axios from "axios";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    // Show preview before uploading
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("pricePerDay", formData.pricePerDay);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      await axios.post("https://localhost:3000/api/vehicles", data);
      alert("✅ Vehicle added successfully!");

      // Reset form
      setFormData({
        name: "",
        brand: "",
        pricePerDay: "",
        description: "",
        image: null,
      });
      setPreview(null);
    } catch (error) {
      console.error("❌ Error adding vehicle:", error);
      alert("❌ Failed to add vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-extrabold tracking-wide mb-6 flex items-center gap-2">
        🚗 Add a New Vehicle
      </h2>

      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 shadow-lg rounded-lg w-full max-w-lg border border-gray-200"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Vehicle Name</label>
          <input 
            type="text" 
            name="name" 
            placeholder="Enter vehicle name" 
            onChange={handleChange} 
            value={formData.name} 
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Brand</label>
          <input 
            type="text" 
            name="brand" 
            placeholder="Enter brand" 
            onChange={handleChange} 
            value={formData.brand} 
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Price Per Day</label>
          <input 
            type="number" 
            name="pricePerDay" 
            placeholder="Enter rental price per day" 
            onChange={handleChange} 
            value={formData.pricePerDay} 
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea 
            name="description" 
            placeholder="Enter description" 
            onChange={handleChange} 
            value={formData.description} 
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300" 
            required
          ></textarea>
        </div>

        {/* Image Upload with Preview */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Upload Image</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300" 
            required 
          />
          {preview && (
            <div className="mt-3 flex justify-center">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-40 h-40 object-cover rounded border border-gray-300 shadow-lg"
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className={`w-full text-white py-3 rounded font-semibold tracking-wide transition-all duration-300 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`} 
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;
