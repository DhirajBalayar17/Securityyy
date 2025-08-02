require("dotenv").config();
const Vehicle = require("../model/vehicle");
const multer = require("multer");
const path = require("path");
const User = require("../model/user");
const Booking = require("../model/Booking");
const vehicle = require("../model/vehicle");

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Store images in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});

const upload = multer({ storage: storage });

// Get all vehicles
const findAll = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        const vehiclesWithImageUrls = vehicles.map(vehicle => ({
            ...vehicle.toObject(),
            imageUrl: `https://localhost:3000/${vehicle.image}`, // Full image URL
        }));
        res.status(200).json(vehiclesWithImageUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching vehicles", error });
    }
};

// Save new vehicle with image
const postData = async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    try {
        const { name, brand, pricePerDay, description } = req.body;
        console.log("📌 Received Booking Data:", req.body);

        if (!name || !brand || !pricePerDay || !description) {
            return res.status(400).json({ message: "All fields including contact are required." });
        }

        const imageUrl = req.file.path
        console.log(imageUrl)

        // ✅ Create a new booking with provided contact details
        const newVehicle = new vehicle({
            name: name,
            brand: brand,
            pricePerDay: pricePerDay,
            description: description,
            image: imageUrl
        });

        await newVehicle.save();
        console.log("✅ Vehicle created successfully:", newVehicle);

        res.status(201).json({ message: "Vehicle created successfully.", vehicle: newVehicle });
    } catch (error) {
        console.error("❌ Error creating vehicle:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get vehicle by ID
const findById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json({
            ...vehicle.toObject(),
            imageUrl: `http://localhost:3000/${vehicle.image}`, // Full image URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching vehicle", error });
    }
};

// Delete vehicle by ID
const deleteById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting vehicle", error });
    }
};

// Update vehicle details
const update = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json({ message: "Vehicle updated successfully", vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating vehicle", error });
    }
};

module.exports = {
    findAll,
    postData,
    findById,
    deleteById,
    update,
    upload 
};
