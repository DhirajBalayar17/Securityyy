import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Extract token from query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");
    if (!t) {
      toast.error("Missing token!", { position: "top-center" });
      navigate("/login");
    }
    setToken(t);
  }, [location, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://localhost:3000/api/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success(res.data.message || "Password updated successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const msg =
        error.response?.data?.error || "Failed to reset password. Try again.";
      toast.error(msg, { position: "top-center", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">
      <ToastContainer />
      <div className="w-96 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-500">
          🔒 Reset Password
        </h2>

        <form onSubmit={handleResetPassword}>
          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium">New Password:</label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={22} />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-gray-100 dark:bg-gray-700"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Confirm Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-gray-100 dark:bg-gray-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "🔄 Updating..." : "🔐 Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
