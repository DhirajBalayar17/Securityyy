const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  username: { type: String, required: true },

  // SHA-256 hashed email for uniqueness check and database query
  email: { type: String, required: true, unique: true },

  // AES-encrypted email for sending welcome email or future decryption
  emailPlain: { type: String, required: true },

  // AES-encrypted phone number for secure storage
  phone: { type: String, required: true },

  // Hashed password using bcrypt
  hashedPassword: { type: String, required: true },

  otp: { type: String, required: true },
  otpExpires: { type: Date, required: true },

  role: { type: String, default: "user" },
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
