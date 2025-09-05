import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../utils/api"; // Updated to use Axios instance

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/auth/check"); // Updated URL
        setIsAuthenticated(response.data.message === "Authenticated");
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
