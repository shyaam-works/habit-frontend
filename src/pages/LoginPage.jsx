import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import "../styles/LoadingSpinner.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async (retries = 2, delay = 100) => {
    try {
      const res = await api.get("/api/auth/check");
      const authenticated = res.data.message === "Authenticated";
      setIsAuthenticated(authenticated);
      return authenticated;
    } catch (err) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return checkAuth(retries - 1, delay * 2);
      }
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/api/auth/login", { email, password });
      const isAuth = await checkAuth();
      if (isAuth) {
        toast.success("Logged in successfully");
      } else {
        setError("Authentication failed after login");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="loadingspinner">
          <div id="square1"></div>
          <div id="square2"></div>
          <div id="square3"></div>
          <div id="square4"></div>
          <div id="square5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-[90%] sm:max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-sm text-gray-600 hover:text-green-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
            disabled={isLoading}
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Not registered?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
