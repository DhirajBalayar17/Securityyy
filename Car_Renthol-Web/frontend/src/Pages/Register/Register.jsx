import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/api";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: "", color: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*#?&]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
      case 2:
        return { level: "Weak", color: "bg-red-500 w-1/5" };
      case 3:
        return { level: "Medium", color: "bg-yellow-500 w-2/5" };
      case 4:
        return { level: "Good", color: "bg-blue-500 w-3/5" };
      case 5:
        return { level: "Strong", color: "bg-green-500 w-4/5" };
      default:
        return { level: "", color: "" };
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess("");
    const errors = {};

    if (!name) errors.name = "Full Name is required";
    if (!email) errors.email = "Email is required";
    if (!phone) errors.phone = "Phone number is required";
    if (!password) errors.password = "Password is required";
    if (!confirmPassword) errors.confirmPassword = "Confirm Password is required";

    if (phone && !/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (password && !strongPasswordRegex.test(password)) {
      errors.password =
        "Password must include uppercase, lowercase, number, special character and be at least 8 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const userData = { username: name, email, phone, password };
      await registerUser(userData);
      setSuccess("Registration successful! Please verify your email.");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      setFieldErrors({ general: error.response?.data?.error || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Create Account</h2>

        {fieldErrors.general && <p className="text-red-500 text-center mb-4">{fieldErrors.general}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleRegister} noValidate>
          {/* Full Name */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-medium">Full Name:</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full p-3 pl-10 border ${
                  fieldErrors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg mt-1`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors({});
                }}
              />
              <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
            {fieldErrors.name && <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-medium">Email:</label>
            <div className="relative">
              <input
                type="email"
                className={`w-full p-3 pl-10 border ${
                  fieldErrors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg mt-1`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors({});
                }}
              />
              <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
            {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-medium">Phone Number:</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full p-3 pl-10 border ${
                  fieldErrors.phone ? "border-red-500" : "border-gray-300"
                } rounded-lg mt-1`}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setFieldErrors({});
                }}
              />
              <AiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
            {fieldErrors.phone && <p className="text-sm text-red-500 mt-1">{fieldErrors.phone}</p>}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-medium">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full p-3 pl-10 pr-10 border ${
                  fieldErrors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg mt-1`}
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  setFieldErrors({});
                  setPasswordStrength(getPasswordStrength(val));
                }}
              />
              <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
              </button>
            </div>
            {password && (
              <div className="mt-1">
                <div className="h-1 w-full bg-gray-200 rounded">
                  <div className={`h-1 rounded transition-all duration-300 ${passwordStrength.color}`}></div>
                </div>
                <p className="text-xs mt-1 text-gray-600">{passwordStrength.level}</p>
              </div>
            )}
            {fieldErrors.password && <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-medium">Confirm Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full p-3 pl-10 border ${
                  fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg mt-1`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors({});
                }}
              />
              <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
            {fieldErrors.confirmPassword && <p className="text-sm text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className={`w-full text-white p-3 rounded-lg transition duration-300 font-medium ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
