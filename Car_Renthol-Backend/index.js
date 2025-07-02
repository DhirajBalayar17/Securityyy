require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const path = require("path");
const mime = require("mime-types");

const connectDb = require("./config/db");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDb()
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ DB Error:", err.message);
    logger.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  });

// ✅ Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS (fixed allowedHeaders)
app.use(
  cors({
    origin: ["https://localhost:5173", "https://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",   // ✅ required for frontend to send CSRF token
      "X-XSRF-TOKEN",   // ✅ also allow this in case naming varies
    ],
  })
);

// ✅ Secure Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSuperSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

// ✅ CSRF Token Middleware
const csrfProtection = csrf({ cookie: true });

// ✅ Endpoint to send CSRF token
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false, // ✅ must be accessible by frontend js-cookie
    secure: true,
    sameSite: "lax",
  });
  res.status(200).json({ message: "CSRF token sent" });
});

// ✅ Static uploads with proper headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if (mimeType) res.setHeader("Content-Type", mimeType);
      res.setHeader("Access-Control-Allow-Origin", "https://localhost:5173");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// ✅ API Routes
app.use("/api/users", require("./router/userRouter"));
app.use("/api/vehicles", require("./router/VehicleRouter"));
app.use("/api/bookings", require("./router/BookingRouter"));
app.use("/api/auth", require("./router/AuthRouter"));
app.use("/api/admin", require("./router/AdminRouter"));

// ✅ Serve Frontend Static Files (React Build)
app.use(
  express.static(path.join(__dirname, "../frontend/dist"), {
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if (mimeType) res.setHeader("Content-Type", mimeType);
    },
  })
);

// ✅ React SPA fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ HTTPS Server using mkcert certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "localhost+2-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "localhost+2.pem")),
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🔐 Backend running securely at https://localhost:${PORT}`);
});

module.exports = app;
