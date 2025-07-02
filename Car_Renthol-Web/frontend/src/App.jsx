import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Import Components
import About from "./components/About/About";
import CarList from "./Pages/CarList/CarList";
import CarDetails from "./Pages/CarDetails/CarDetails";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import Services from "./components/Services/Services";
import Testimonial from "./components/Testimonial/Testimonial";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import BookingForm from "./Pages/Booking/BookingForm";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/EditProfile/EditProfile";
import MyBookings from "./Pages/MyBooking/MyBookings";

// Admin Pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminPanel from "./Pages/Admin/AdminPanel";
import ManageUsers from "./Pages/Admin/ManageUsers";
import ManageBookings from "./Pages/Admin/ManageBookings";
import ManageCars from "./Pages/Admin/ManageCars";
import AddVehicle from "./Pages/Admin/AddVehicle";
import EditVehicle from "./Pages/Admin/EditVehicle";
import Sidebar from "./components/Sidebar/Sidebar";

// Password Recovery
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/ForgetPassword/ResetPassword";

// ✅ OTP Page
import VerifyOtp from "./Pages/Register/VerifyOtp";

// ✅ CSRF Token Fetcher (fixed path)
import { fetchCsrfToken } from "./api/api";

// ✅ Home Section
const Home = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Hero />
      <About />
      <Services />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
};

// ✅ Auth Check
const isAuthenticated = () => !!localStorage.getItem("token");
const getUserRole = () => localStorage.getItem("role") || "user";

// ✅ Protected Routes
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

// ✅ Admin Route with Sidebar
const AdminRoute = ({ element }) => {
  if (!isAuthenticated() || getUserRole() !== "admin") {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56 p-6 bg-gray-100">{element}</div>
    </div>
  );
};

// ✅ Layout Wrapper (hide navbar on admin routes)
const Layout = ({ children, theme, setTheme }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
      {!isAdminPage && <Navbar theme={theme} setTheme={setTheme} />}
      {children}
    </div>
  );
};

// ✅ Main App Component
const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(null);

  // ✅ Apply theme and fetch CSRF token
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);

    const storedUser = {
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
    };
    if (storedUser.username) setUser(storedUser);

    AOS.init({ offset: 100, duration: 800, easing: "ease-in-sine", delay: 100 });

    fetchCsrfToken()
      .then(() => console.log(" CSRF token initialized"))
      .catch((err) => console.error(" CSRF fetch error:", err));

    console.log("✅ App Loaded with User:", storedUser);
    console.log("✅ Theme:", theme);
  }, [theme]);

  return (
    <Router>
      <Layout theme={theme} setTheme={setTheme}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected User Routes */}
          <Route path="/booking/:id" element={<ProtectedRoute element={<BookingForm />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/edit-profile/:id" element={<ProtectedRoute element={<EditProfile setUser={setUser} />} />} />
          <Route path="/my-bookings" element={<ProtectedRoute element={<MyBookings />} />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
          <Route path="/admin/manage-users" element={<AdminRoute element={<ManageUsers />} />} />
          <Route path="/admin/manage-bookings" element={<AdminRoute element={<ManageBookings />} />} />
          <Route path="/admin/manage-cars" element={<AdminRoute element={<ManageCars />} />} />
          <Route path="/admin/manage-cars/edit/:id" element={<AdminRoute element={<EditVehicle />} />} />
          <Route path="/admin/add-vehicle" element={<AdminRoute element={<AddVehicle />} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
