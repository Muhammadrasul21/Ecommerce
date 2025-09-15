import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { PropsAuth } from "../types/type";

const RequireAuth = ({
  children,
  allowRoles = ["admin", "user"],
}: PropsAuth) => {
  const auth = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!auth.isAuthenticated || !auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireAuth;
