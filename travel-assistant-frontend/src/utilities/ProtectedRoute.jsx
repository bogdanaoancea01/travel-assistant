import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  return user
  ? children
  : <Navigate to="/signin" state={{ from: location }} replace />;
}