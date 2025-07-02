import axios from "axios";

// ✅ Use environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🧠 Required for cookie-based auth
});

// ✅ Helper to get cookie (used for CSRF)
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

// ✅ Fetch CSRF token
export const fetchCsrfToken = async () => {
  try {
    const response = await api.get("/csrf-token");
    console.log("✅ CSRF token fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ CSRF Fetch Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Register
export const registerUser = async (userData) => {
  try {
    const csrfToken = getCookie("XSRF-TOKEN");
    const response = await api.post("/auth/register", userData, {
      headers: {
        "X-XSRF-TOKEN": csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Registration Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Login
export const loginUser = async (userData) => {
  try {
    const csrfToken = getCookie("XSRF-TOKEN");
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

export default api;