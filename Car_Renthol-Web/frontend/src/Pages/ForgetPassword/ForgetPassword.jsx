import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineMail } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending password reset request for:", email);
      const response = await axios.post("https://localhost:3000/api/auth/forgot-password", { email }, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Forget Password Response:", response);
      toast.success("✅ Reset link sent! Check your email.", { position: "top-center", autoClose: 2000 });

      // Redirect to login after a short delay
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Forget Password Error:", error);
      const errorMessage = error.response?.data?.error || "Failed to send reset email. Try again.";
      toast.error("❌ " + errorMessage, { position: "top-center", autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">
      <ToastContainer />
      <div className="w-96 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-500">🔑 Forgot Password</h2>

        <form onSubmit={handleForgetPassword}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter your email:</label>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 font-medium flex justify-center"
            disabled={loading}
          >
            {loading ? "🔄 Sending..." : "📩 Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
