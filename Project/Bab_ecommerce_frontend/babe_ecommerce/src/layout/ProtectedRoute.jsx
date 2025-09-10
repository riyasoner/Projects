import { Navigate } from "react-router-dom";
import React from "react";

function ProtectedRoute({ children, allowedTypes }) {
  const userType = localStorage.getItem("userType"); 

  if (!userType) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
