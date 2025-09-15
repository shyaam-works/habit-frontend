import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/auth/check");
        setIsAuthenticated(response.data.message === "Authenticated");
        setError("");
      } catch (err) {
        setIsAuthenticated(false);
        setError("");
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {});
      setIsAuthenticated(false);
      setError("");
      setIsMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Error logging out", err);
      setError(err.response?.data?.error || "Failed to logout");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center ${
          isAuthenticated ? "justify-between" : "justify-center"
        }`}
      >
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold text-black-600 tracking-wide"
        >
          HabitTracker
        </Link>

        {isAuthenticated && (
          <>
            <button
              className="sm:hidden text-slate-700 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
            <div
              className={`${
                isMenuOpen ? "block" : "hidden"
              } sm:flex sm:items-center sm:space-x-10 absolute sm:static top-14 left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-md sm:shadow-none p-4 sm:p-0 z-40`}
            >
              <Link
                to="/"
                className="block sm:inline-block text-base md:text-lg font-semibold text-slate-700 hover:text-sky-600 transition mb-2 sm:mb-0"
                onClick={() => setIsMenuOpen(false)}
              >
                All Habits
              </Link>
              <Link
                to="/add"
                className="block sm:inline-block text-base md:text-lg font-semibold text-slate-700 hover:text-sky-600 transition mb-2 sm:mb-0"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Habit
              </Link>
              <Link
                to="/all-habits-heat"
                className="block sm:inline-block text-base md:text-lg font-semibold text-slate-700 hover:text-sky-600 transition mb-2 sm:mb-0"
                onClick={() => setIsMenuOpen(false)}
              >
                All Habits Heat
              </Link>
              <button
                onClick={handleLogout}
                className="block sm:inline-block text-xs sm:text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded px-3 sm:px-4 py-1.5 sm:py-2 transition"
              >
                Logout
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="absolute top-14 right-4 sm:right-6 text-red-500 text-sm md:text-base">
            {error}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
