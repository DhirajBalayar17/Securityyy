import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ Needed for CSRF token from cookie
import { AiOutlineMail, AiOutlineKey } from "react-icons/ai";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Get email from navigation state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate("/register");
    }
  }, [location.state, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Get CSRF token from cookie
      const csrfToken = Cookies.get("XSRF-TOKEN"); // default name used by csurf

      const response = await axios.post(
        "https://localhost:3000/api/auth/verify-otp",
        { email, otp },
        {
          withCredentials: true, // ✅ send cookies with request
          headers: {
            "X-CSRF-Token": csrfToken, // ✅ send CSRF token from cookie
          },
        }
      );

      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Verify Your Email</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleVerify}>
          {/* Email (disabled + autofilled) */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-medium">Email:</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-3 pl-10 border border-gray-300 text-gray-500 bg-gray-100 rounded-lg mt-1"
              />
              <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* OTP input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-medium">OTP:</label>
            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 text-gray-800 bg-white rounded-lg mt-1"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
              <AiOutlineKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white p-3 rounded-lg transition duration-300 font-medium ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
