import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/api";
import { fetchCsrfToken } from "../../axios"; // ✅ Import CSRF fetcher
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  // ✅ Ensure CSRF token is fetched on page load
  useEffect(() => {
    fetchCsrfToken()
      .then(() => console.log("✅ CSRF token refreshed on Login page"))
      .catch((err) => console.error("❌ CSRF fetch error on Login", err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!captchaToken) {
      toast.error("❌ Please complete the CAPTCHA.", {
        position: "top-center",
        autoClose: 2000,
      });
      setLoading(false);
      return;
    }

    try {
      const userData = { email, password, captchaToken };
      const response = await loginUser(userData);

      if (!response.userId || !response.username || !response.email || !response.role) {
        throw new Error("❌ User details not found in response");
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("username", response.username);
      localStorage.setItem("email", response.email);
      localStorage.setItem("role", response.role);

      toast.success(`✅ Welcome, ${response.username}!`, {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate(response.role === "admin" ? "/admin" : "/");
        window.location.reload();
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.error || "❌ Login failed. Please try again.";

      if (recaptchaRef.current) {
        recaptchaRef.current.reset(); // ✅ Visually reset reCAPTCHA box
        setCaptchaToken(""); // ✅ Clear token
        toast.error("🔁 CAPTCHA reset. Please solve it again.", {
          position: "top-center",
          autoClose: 2000,
        });
      }

      if (message.includes("Too many login attempts")) {
        toast.error("🚫 Too many failed attempts. Try again after 10 minutes.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">
      <ToastContainer />
      <div className="w-96 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-500">🔓 Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={22} />
              <input
                type="email"
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password:</label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={22} />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
              </button>
            </div>
          </div>

          <div className="mb-4 text-right">
            <button
              type="button"
              className="text-blue-500 hover:underline text-sm"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          <div className="mb-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken("")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 font-medium flex justify-center"
            disabled={loading}
          >
            {loading ? "🔄 Logging in..." : "🔓 Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
