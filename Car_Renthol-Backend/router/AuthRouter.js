const express = require("express");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyOtp,
} = require("../controller/AuthController");

// ✅ Brute-force protection for login
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    error: "Too many login attempts from this IP. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ CSRF middleware (cookie-based)
const csrfProtection = csrf({ cookie: true });

// ✅ Core Routes (CSRF-protected)
router.post("/register", csrfProtection, register);
router.post("/verify-otp", csrfProtection, verifyOtp);
router.post("/login", loginLimiter, csrfProtection, login);
router.post("/forgot-password", csrfProtection, forgotPassword);
router.post("/reset-password", csrfProtection, resetPassword);

// ✅ Session Check
router.get("/me", (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({
      userId: req.session.user._id,
      username: req.session.user.username,
      email: req.session.user.email,
      role: req.session.user.role,
    });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
});

// ✅ Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Logout error:", err.message);
      return res.status(500).json({ error: "Logout failed" });
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
