import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
