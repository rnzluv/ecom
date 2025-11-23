import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !user) return <Navigate to="/login" replace />;

    if (adminOnly && user.role !== "admin") return <Navigate to="/books" replace />;

    return children;
};

export default ProtectedRoute;
