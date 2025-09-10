import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api"; // Updated to use Axios instance

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/auth/check"); // Updated URL
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
      await api.post("/api/auth/logout", {}); // Updated URL
      setIsAuthenticated(false);
      setError("");
      navigate("/login");
    } catch (err) {
      console.error("Error logging out", err);
      setError(err.response?.data?.error || "Failed to logout");
    }
  };

  return (
    <nav className=" bg-white shadow-md fixed top-0 left-0 w-full z-50 ">
      <div
        className={`max-w-7xl mx-auto px-6 py-5 flex items-center ${
          isAuthenticated ? "justify-between" : "justify-center"
        }`}
      >
        <Link
          to="/"
          className="text-3xl font-extrabold text-slate-800 tracking-wide"
        >
          HabitTracker
        </Link>

        {isAuthenticated && (
          <div className="flex items-center space-x-10 text-slate-700">
            <Link
              to="/"
              className="text-xl font-semibold hover:text-sky-600 transition"
            >
              All Habits
            </Link>
            <Link
              to="/add"
              className="text-xl font-semibold hover:text-sky-600 transition"
            >
              Add Habit
            </Link>
            <Link
              to="/all-habits-heat"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              All Habits Heat
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}

        {error && (
          <div className="absolute top-16 right-6 text-red-500">{error}</div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
