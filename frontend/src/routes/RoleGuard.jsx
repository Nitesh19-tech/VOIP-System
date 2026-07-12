import { Navigate } from "react-router-dom";

export default function RoleGuard({ roles, user, children }) {
  if (!user) return null;

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
