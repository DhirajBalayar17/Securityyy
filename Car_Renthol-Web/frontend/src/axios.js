import axios from "axios";

// ✅ Base URL - uses .env or defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🧠 Required to send session cookies
});

// 🧁 Helper: Extract cookie by name (for CSRF token)
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

// ✅ Register User API
export const registerUser = async (userData) => {
  try {
    console.log("📤 Sending registration request to:", `${API_BASE_URL}/auth/register`);
    const csrfToken = getCookie("XSRF-TOKEN");

    const response = await api.post("/auth/register", userData, {
      headers: {
        "X-XSRF-TOKEN": csrfToken, // ✅ Attach CSRF token manually
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Registration Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Login User API
export const loginUser = async (userData) => {
  try {
    const csrfToken = getCookie("XSRF-TOKEN");
    console.log("📤 Sending login request with CSRF token:", csrfToken);

    const response = await api.post("/auth/login", userData, {
      headers: {
        "X-XSRF-TOKEN": csrfToken, 
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch CSRF Token on app load
export const fetchCsrfToken = async () => {
  try {
    const response = await api.get("/csrf-token"); // 🍪 Backend sets XSRF-TOKEN cookie
    console.log("✅ CSRF token fetched");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch CSRF token:", error);
    throw error;
  }
};

export default api;
