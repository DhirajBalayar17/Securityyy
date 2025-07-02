const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  email: { type: String },
  activityType: { type: String, required: true }, // e.g., 'login', 'register', 'otp', 'reset'
  status: { type: String, enum: ["success", "failed"], required: true },
  message: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  sessionId: { type: String }, // ✅ Added field for session ID
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
