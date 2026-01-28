import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext.jsx";

{/* no permite volver atrás */}
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}