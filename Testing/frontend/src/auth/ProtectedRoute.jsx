import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";


export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}