import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/ApiContext";

export default function ProtectedRoute({ children, allowedRole = [] }) {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!role || !isAuthenticated) {
    navigate("/login");
  }

  if (!allowedRole.includes(role)) {
    navigate("/");
  }
  return children;
}
