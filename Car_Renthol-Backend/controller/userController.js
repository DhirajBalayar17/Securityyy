// require("dotenv").config();
// const User = require("../model/user");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Get all users (excluding passwords)
// const findAll = async (req, res) => {
//     try {
//         const users = await User.find().select("-password");
//         res.status(200).json(users);
//     } catch (error) {
//         console.error("❌ Error fetching users:", error.message);
//         res.status(500).json({ message: "Error fetching users", error: error.message });
//     }
// };

// // Register new user
// const postData = async (req, res) => {
//   try {
//     const { username, email, password, phone, role } = req.body;

//     if (!username || !email || !password || !phone) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       phone,
//       role: role === "admin" ? "admin" : "user",
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully", user: newUser });
//   } catch (error) {
//     console.error("❌ Error registering user:", error.message);

//     // ✅ Duplicate key error handling (e.g., email or phone)
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyValue)[0];
//       return res.status(400).json({ message: `${field} already in use` });
//     }

//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// // Get user by ID
// const findById = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).select("-password");
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         console.error("❌ Error fetching user:", error.message);
//         res.status(500).json({ message: "Error fetching user", error: error.message });
//     }
// };

// // Delete user by ID
// const deleteById = async (req, res) => {
//     try {
//         const adminId = req.user.userId;
//         const userIdToDelete = req.params.id;

//         const admin = await User.findById(adminId);
//         if (!admin || admin.role !== "admin") {
//             return res.status(403).json({ message: "Unauthorized: Only admins can delete users" });
//         }

//         if (adminId === userIdToDelete) {
//             return res.status(403).json({ message: "Admins cannot delete their own account!" });
//         }

//         const user = await User.findByIdAndDelete(userIdToDelete);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({ message: "User deleted successfully" });
//     } catch (error) {
//         console.error("❌ Error deleting user:", error.message);
//         res.status(500).json({ message: "Error deleting user", error: error.message });
//     }
// };

// // Update user details (secure)
// const update = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const token = req.headers.authorization?.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({ message: "Unauthorized, no token provided" });
//         }

//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.JWT_SECRET);
//         } catch (error) {
//             return res.status(401).json({ message: "Invalid or expired token" });
//         }

//         if (decoded.userId !== userId && decoded.role !== 'admin') {
//             return res.status(403).json({ message: "Unauthorized to update this profile" });
//         }

//         const existingUser = await User.findById(userId);
//         if (!existingUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const filteredData = { ...req.body };
//         delete filteredData.role;
//         delete filteredData.email;
//         delete filteredData.password;

//         // Admins can update email/role
//         if (decoded.role === "admin") {
//             if (req.body.email && req.body.email !== existingUser.email) {
//                 const emailExists = await User.findOne({ email: req.body.email });
//                 if (emailExists) {
//                     return res.status(400).json({ message: "Email already in use" });
//                 }
//                 filteredData.email = req.body.email;
//             }
//             if (req.body.role) {
//                 filteredData.role = req.body.role;
//             }
//         }

//         // Password update
//         if (req.body.password) {
//             if (req.body.password.length < 6) {
//                 return res.status(400).json({ message: "Password must be at least 6 characters long" });
//             }
//             filteredData.password = await bcrypt.hash(req.body.password, 10);
//         }

//         Object.assign(existingUser, filteredData);
//         await existingUser.save();

//         res.status(200).json({ message: "Profile updated successfully", user: existingUser });
//     } catch (error) {
//         console.error("❌ Error updating user:", error.message);
//         res.status(500).json({ message: "Error updating user", error: error.message });
//     }
// };

// module.exports = { findAll, postData, findById, deleteById, update };


require("dotenv").config();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get all users (excluding passwords)
const findAll = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Register new user
const postData = async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body;

    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role: role === "admin" ? "admin" : "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("❌ Error registering user:", error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already in use` });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user by ID
const findById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Delete user by ID
const deleteById = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const userIdToDelete = req.params.id;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Only admins can delete users" });
    }

    if (adminId === userIdToDelete) {
      return res.status(403).json({ message: "Admins cannot delete their own account!" });
    }

    const user = await User.findByIdAndDelete(userIdToDelete);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// Update user details securely
const update = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (decoded.userId !== userId && decoded.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const filteredData = { ...req.body };
    delete filteredData.role;
    delete filteredData.email;
    delete filteredData.password;

    // ✅ Allow only admins to change email and role
    if (decoded.role === "admin") {
      if (req.body.email && req.body.email !== existingUser.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          return res.status(400).json({ message: "Email already in use" });
        }
        filteredData.email = req.body.email;
      }

      if (req.body.role) {
        filteredData.role = req.body.role;
      }
    }

    // ✅ Password update (for any role, including user)
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      filteredData.password = await bcrypt.hash(req.body.password, 10);
    }

    // 🔄 Merge and save updates
    Object.assign(existingUser, filteredData);
    await existingUser.save();

    res.status(200).json({ message: "Profile updated successfully", user: existingUser });
  } catch (error) {
    console.error("❌ Error updating user:", error.message);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ❌ Block admin access through this route
    if (user.role !== "user") {
      return res.status(403).json({ error: "Admin data cannot be requested through this route!" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error("❌ Error in getSingleUser:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { findAll, postData, findById, deleteById, update, getSingleUser,};
