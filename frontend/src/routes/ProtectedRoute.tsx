import { Navigate } from "react-router-dom";
import { useAuth } from "../context/ApiContext";
import UnauthorizedPage from "../components/Unauthorized";
import FullScreenLoader from "../components/ScreenLoader";

export default function ProtectedRoute({ children, allowedRole = [] }) {
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
