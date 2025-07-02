// const express = require("express");
// const router = express.Router();
// const userController = require("../controller/userController");

// // ✅ User Management Routes
// router.get("/", userController.findAll); // Get all users
// router.get("/:id", userController.findById); // Get user by ID
// router.put("/:id", userController.update); // Update user details (Edit Profile)
// router.delete("/:id", userController.deleteById); // Delete user by ID

// module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// ✅ Register a new user
router.post("/register", userController.postData);

// ✅ Protected User Info (blocks admin access to this route)
router.get("/info", authMiddleware, userController.getSingleUser);

// ✅ User Management Routes
router.get("/", authMiddleware, adminMiddleware, userController.findAll); // Only Admin can view all users
router.get("/:id", authMiddleware, userController.findById); // Authenticated users can get their profile
router.put("/:id", authMiddleware, userController.update);   // Authenticated users can update
router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteById); // Only Admins can delete

module.exports = router;
