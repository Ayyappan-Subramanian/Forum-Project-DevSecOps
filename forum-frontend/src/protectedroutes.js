// src/utils/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
const user = useContext(AuthContext);

  if (!user) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // logged in → render the page
  return children;
};

export default ProtectedRoute;
