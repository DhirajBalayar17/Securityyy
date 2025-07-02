import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiSolidMoon, BiSolidSun } from "react-icons/bi";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import ResponsiveMenu from "./ResponsiveMenu";

export const Navlinks = [
  { id: 1, name: "HOME", link: "/" },
  { id: 2, name: "CARS", link: "/cars" },
  { id: 3, name: "ABOUT", link: "/about" },
];

const Navbar = ({ theme, setTheme }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");

    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    window.location.reload();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 shadow-md bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-2 md:py-0">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold font-serif">Car Rental</Link>

          <nav className="hidden md:flex items-center gap-8">
            {Navlinks.map(({ id, name, link }) => (
              <Link key={id} to={link} className="text-lg font-medium hover:text-blue-500 py-2 hover:border-b-2 hover:border-blue-500 transition-colors duration-500">
                {name}
              </Link>
            ))}

            {isLoggedIn && (
              <Link to="/my-bookings" className="text-lg font-medium hover:text-blue-500 py-2 hover:border-b-2 hover:border-blue-500 transition-colors duration-500">
                My Bookings
              </Link>
            )}

            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <BiSolidSun className="text-2xl cursor-pointer" /> : <BiSolidMoon className="text-2xl cursor-pointer" />}
            </button>

            {isLoggedIn ? (
              <>
                {/* <Link to="/cart">
                  <FaShoppingCart className="text-xl hover:text-blue-500 transition duration-300 cursor-pointer" />
                </Link> */}

                <div className="relative group">
                  <FaUserCircle className="text-2xl cursor-pointer hover:text-blue-500" />
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg p-2 hidden group-hover:block">
                    <span className="block px-4 py-2 font-medium">Hi, {username}</span>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-4 py-2 transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                  Login
                </Link>
                <Link to="/register" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-4 py-2 transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {showMenu ? <HiMenuAlt1 className="text-2xl cursor-pointer" /> : <HiMenuAlt3 className="text-2xl cursor-pointer" />}
            </button>
          </div>
        </div>
      </div>

      {showMenu && <ResponsiveMenu />}
    </div>
  );
};

export default Navbar;
