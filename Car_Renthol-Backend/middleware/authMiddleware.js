const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Check for session-based auth
    if (req.session?.user) {
      req.user = req.session.user;

      const log = {
        userType: "session",
        userName: req.user.username || "unknown",
        sessionId: req.sessionID,
        url: req.originalUrl,
        method: req.method,
      };
      console.log("📝 Log:", log);
      return next();
    }

    // ✅ Check for JWT auth
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token format" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ JWT Verification Failed:", err.message);
        return res.status(401).json({
          success: false,
          message: err.name === "TokenExpiredError" ? "Token has expired" : "Unauthorized token",
        });
      }

      req.user = decoded;

      const log = {
        userType: "jwt",
        userName: decoded.username || "unknown",
        sessionId: token,
        url: req.originalUrl,
        method: req.method,
      };
      console.log("📝 Log:", log);

      next();
    });
  } catch (error) {
    console.error("❌ Middleware Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied: Admins only" });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
