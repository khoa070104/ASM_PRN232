import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
    const { isAuthenticated, isReady } = useAuth();
    if (!isReady) return null; // tránh nhảy sớm trước khi khôi phục trạng thái
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}


