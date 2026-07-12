import { Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function ProtectedRoute({ user, allowedRoles, children }) {
  // 🔄 Still loading
  if (user === null) {
    return null; // or spinner
  }

  // ❌ Not logged in
  if (user === false) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


