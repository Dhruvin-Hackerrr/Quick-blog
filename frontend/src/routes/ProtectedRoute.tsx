import { Navigate } from "react-router-dom";
import { useAuth } from "../context/ApiContext";
import UnauthorizedPage from "../components/Unauthorized";
import FullScreenLoader from "../components/ScreenLoader";
import type { Role } from "../types/authtype";

export default function ProtectedRoute({ children, allowedRole = [] as Role[] }: {
  children: React.ReactNode;
  allowedRole?: Role[];
}) {
  const { role, isAuthenticated, loading } = useAuth();

  if(loading) {
    return <FullScreenLoader text="Loading..." />
  }

  if (!role || !isAuthenticated) {
    return <Navigate to="/login" replace/>
  }

  if (!allowedRole.includes(role)) {
    return <UnauthorizedPage />
  }
  return children;
}
