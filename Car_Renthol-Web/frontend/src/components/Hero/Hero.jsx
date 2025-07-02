import AOS from "aos";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import images
import yellowCar from "../../assets/banner-car.png"; // Light mode car
import darkCar from "../../assets/car.png"; // Dark mode car

const Hero = () => {
  const navigate = useNavigate();  

  // Get theme from localStorage
  const getTheme = () => localStorage.getItem("theme") || "light";

  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    AOS.refresh();

    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "light";
      setTheme(newTheme);
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  return (
    <div className={`transition-all duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="container min-h-[620px] flex">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center">
          
          {/* Car Image */}
          <div
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-once="false"
            className="order-1 sm:order-2"
          >
            <img
              key={theme} // ✅ Forces image reload when theme changes
              src={theme === "dark" ? darkCar : yellowCar}
              alt="Car"
              className="sm:scale-125 relative -z-10 max-h-[600px] drop-shadow-[2px_20px_6px_rgba(0,0,0,0.50)] transition-opacity duration-300"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-5 order-2 sm:order-1 sm:pr-32">
            <p data-aos="fade-up" className="text-primary text-2xl font-serif">
              Effortless
            </p>
            <h1
              data-aos="fade-up"
              data-aos-delay="600"
              className="text-5xl lg:text-7xl font-semibold font-serif"
            >
              Car Rental
            </h1>
            <p data-aos="fade-up" data-aos-delay="1000">
              Rent a car with ease and convenience. Choose from a variety of vehicles to suit your travel needs. Secure your ride today with a simple booking process.
            </p>
            <button
              data-aos="fade-up"
              data-aos-delay="1500"
              onClick={() => navigate("/cars")}
              className="rounded-md bg-primary hover:bg-primary/80 transition duration-500 py-2 px-6 text-black"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
