const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../model/user");
const PendingUser = require("../model/PendingUser");
const ActivityLog = require("../model/ActivityLog");
const { encrypt, decrypt } = require("../utils/cryptoHelper"); 

 

require("dotenv").config();
const ResetPasswordEmail = require("../templates/resetpasswordemail");
const WelcomeEmail = require("../templates/welcomeemail");
const transporter = require("../middleware/mailConfig");

const SECRET_KEY = process.env.JWT_SECRET;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const logActivity = async ({ userId, email, activityType, status, message, req }) => {
  try {
    await ActivityLog.create({
      userId,
      email,
      activityType,
      status,
      message,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.error("❌ Activity Logging Error:", error.message);
  }
};

const register = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    const hashedEmail = hashSHA256(email.toLowerCase());
    const hashedPhone = hashSHA256(phone);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const existingPending = await PendingUser.findOne({ email: hashedEmail });
    if (existingPending) {
      await PendingUser.deleteOne({ email: hashedEmail });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await PendingUser.create({
      username,
      email: hashedEmail,
      emailPlain: email,
      phone: hashedPhone,
      hashedPassword,
      otp,
      otpExpires,
      role: role || "user",
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);

    await logActivity({
      email,
      activityType: "register",
      status: "success",
      message: "OTP sent",
      req,
    });

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete registration.",
    });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    await logActivity({
      email: req.body.email,
      activityType: "register",
      status: "failed",
      message: error.message,
      req,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};
const { hashSHA256 } = require("../utils/cryptoHelper"); // 📌 Make sure this helper is present

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const hashedEmail = hashSHA256(email.toLowerCase());

    const pending = await PendingUser.findOne({ email: hashedEmail });

    if (!pending) {
      return res.status(404).json({ error: "No pending registration found." });
    }

    if (String(pending.otp) !== String(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (pending.otpExpires < new Date()) {
      await PendingUser.deleteOne({ email: hashedEmail });
      return res.status(400).json({ error: "OTP expired. Please register again." });
    }

    const dateObj = new Date();
    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const formattedDate = `${year}/${month}/${day}`;

    const user = new User({
      username: pending.username,
      email: pending.emailPlain, // ✅ Use plain email
      phone: pending.phone,
      password: pending.hashedPassword,
      role: pending.role,
      passwordLastChanged: new Date(),
      passwordCreated: formattedDate,
      previousPasswords: [pending.hashedPassword],
    });

    await user.save();
    await PendingUser.deleteOne({ email: hashedEmail });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Registration Successful. Welcome!",
      html: WelcomeEmail({ name: user.username }),
    };

    await transporter.sendMail(mailOptions);

    await logActivity({
      userId: user._id,
      email: user.email,
      activityType: "otp-verification",
      status: "success",
      message: "User registered",
      req,
    });

    res.status(201).json({ message: "OTP verified and user registered successfully" });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    await logActivity({
      email: req.body.email,
      activityType: "otp-verification",
      status: "failed",
      message: error.message,
      req,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};






// Profile update activity
const updateProfile = async (req, res) => {
  try {
    const { username, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.username = username || user.username;
    user.phone = phone || user.phone;
    await user.save();

    await logActivity({ userId: user._id, email: user.email, activityType: "profile-update", status: "success", message: "Profile updated", req });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    await logActivity({ userId: req.user._id, email: req.user.email, activityType: "profile-update", status: "failed", message: error.message, req });
    res.status(500).json({ error: "Profile update failed" });
  }
};

// Role change activity
const changeUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    await logActivity({ userId: user._id, email: user.email, activityType: "role-change", status: "success", message: `Role changed from ${oldRole} to ${newRole}`, req });
    res.json({ message: "User role updated" });
  } catch (error) {
    await logActivity({ userId: req.body.userId, activityType: "role-change", status: "failed", message: error.message, req });
    res.status(500).json({ error: "Role change failed" });
  }
};

// Admin deletes user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await logActivity({ userId: user._id, email: user.email, activityType: "user-deletion", status: "success", message: "User deleted by admin", req });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    await logActivity({ userId: req.params.userId, activityType: "user-deletion", status: "failed", message: error.message, req });
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Account lockout example usage
const lockAccount = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Your logic to lock account, e.g., set a locked flag or expiry
    user.isLocked = true;
    await user.save();

    await logActivity({ userId: user._id, email: user.email, activityType: "account-lockout", status: "success", message: "User account locked", req });
    res.json({ message: "User account locked" });
  } catch (error) {
    await logActivity({ userId: req.body.userId, activityType: "account-lockout", status: "failed", message: error.message, req });
    res.status(500).json({ error: "Failed to lock account" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;
    if (!email || !password || !captchaToken) {
      return res.status(400).json({ error: "Email, password, and CAPTCHA are required" });
    }

    const captchaRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!captchaRes.data.success) {
      return res.status(400).json({ error: "CAPTCHA verification failed" });
    }

    // ✅ FIXED: Add this to get user
    const user = await User.findOne({ email });
if (!user) {
  await logActivity({ email, activityType: "login", status: "failed", message: "User not found", req });
  return res.status(401).json({ error: "Invalid email or password" });
}

// 🔒 Check if account is locked
if (user.lockUntil && user.lockUntil > new Date()) {
  return res.status(403).json({
    error: "Account locked. Try again after 10 minutes.",
    lockedUntil: user.lockUntil,
  });
}

// ✅ Compare input password with stored hash
const isMatch = await bcrypt.compare(password, user.password);


   if (!isMatch) {
  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

  if (user.failedLoginAttempts >= 5) {
    user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // lock for 10 minutes
    await user.save();
    await logActivity({
      userId: user._id,
      email,
      activityType: "login",
      status: "failed",
      message: "Account locked after 5 failed attempts",
      req,
    });
    return res.status(403).json({ error: "Account locked. Try again after 10 minutes." });
  }

  await user.save();
  await logActivity({
    userId: user._id,
    email,
    activityType: "login",
    status: "failed",
    message: `Incorrect password (${user.failedLoginAttempts} attempts)`,
    req,
  });

  return res.status(401).json({ error: "Invalid email or password" });
}
// ✅ Reset failed attempts on success
user.failedLoginAttempts = 0;
user.lockUntil = undefined;
await user.save();

// 📅 Get today's date in "YYYY/MM/DD" format
const now = new Date();
const todayStr = `${now.getUTCFullYear()}/${now.getUTCMonth() + 1}/${now.getUTCDate()}`;

// 🔐 Compare with the user's password creation date
const today = new Date(todayStr);
const created = new Date(user.passwordCreated);

// ⏳ Calculate difference in days
const diffDays = Math.floor((today - created) / (1000 * 60 * 60 * 24));

// ⚠️ Password Expiry Check (90 days)
if (diffDays > 90) {
  return res.status(403).json({
    status: "Password expired",
    role: user.role,
    passwordExpired: true,
  });
}

// ✅ If not expired, proceed with login
req.session.authenticated = true;
req.session.user = {
  id: user.id,
  userName: user.userName,
  role: user.role,
};




    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
      SECRET_KEY,
      { expiresIn: "10m" }
    );

    await logActivity({ userId: user._id, email, activityType: "login", status: "success", message: "Login successful", req });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 10 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    await logActivity({ email: req.body.email, activityType: "login", status: "failed", message: error.message, req });
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Session destroy error:", err);
        return res.status(500).json({ error: "Failed to destroy session" });
      }

      // ✅ Clear all related cookies
      res.clearCookie("connect.sid", {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      res.clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });

      logActivity({
        userId: req.user?._id,
        email: req.user?.email,
        activityType: "logout",
        status: "success",
        message: "User logged out",
        req,
      });

      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    await logActivity({
      activityType: "logout",
      status: "failed",
      message: error.message,
      req,
    });
    res.status(500).json({ error: "Logout failed" });
  }
};



const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = jwt.sign({ user_id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: ResetPasswordEmail({ email: user.email, resetLink }),
    };

    await transporter.sendMail(mailOptions);
    await logActivity({ userId: user._id, email, activityType: "forgot-password", status: "success", message: "Reset link sent", req });
    res.json({ message: "Password reset link sent! Check your email." });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    await logActivity({ email: req.body.email, activityType: "forgot-password", status: "failed", message: error.message, req });
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // 🚫 Validate inputs
  if (!token) return res.status(400).json({ error: "Reset token is required" });
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    // ✅ Decode token and find user
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔒 Check if new password matches current password
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return res.status(400).json({ error: "New password cannot be the same as your current password." });
    }

    // 🔒 Check against previously used passwords
    let isPreviouslyUsed = false;
    for (const oldHash of user.previousPasswords || []) {
      const match = await bcrypt.compare(newPassword, oldHash);
      if (match) {
        isPreviouslyUsed = true;
        break;
      }
    }

    if (isPreviouslyUsed) {
      return res.status(400).json({ error: "You have already used this password. Please choose a different one." });
    }

    // 🔑 Hash the new password after validation
    const newHashed = await bcrypt.hash(newPassword, 10);

    // 🌀 Rotate previous passwords (keep only last 5)
    const updatedPrevious = user.previousPasswords || [];
    if (!updatedPrevious.includes(user.password)) {
      if (updatedPrevious.length >= 5) updatedPrevious.shift(); // remove oldest
      updatedPrevious.push(user.password); // add current
    }

    // 📝 Update user
    user.password = newHashed;
    user.passwordLastChanged = new Date();
    user.previousPasswords = updatedPrevious;

    await user.save();

    // 📜 Log success
    await logActivity({
      userId: user._id,
      email: user.email,
      activityType: "reset-password",
      status: "success",
      message: "Password reset successful",
      req,
    });

    res.json({ message: "Password reset successful. You can now log in!" });

  } catch (error) {
    // ❌ Handle token issues or general errors
    const msg =
      error.name === "TokenExpiredError"
        ? "Reset token has expired"
        : error.name === "JsonWebTokenError"
        ? "Invalid reset token"
        : "Internal server error";

    await logActivity({
      email: req.body.email,
      activityType: "reset-password",
      status: "failed",
      message: msg,
      req,
    });

    res.status(401).json({ error: msg });
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  changeUserRole,
  deleteUser,
  lockAccount,
};

