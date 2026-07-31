import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../context/user/UserContext";

const RequireAdmin = ({ children }) => {
  const { user } = useContext(UserContext);
  const canManageStore = user.isLoggedIn && user.role === "admin";

  useEffect(() => {
    if (!canManageStore) {
      toast.error("Admin access required.");
    }
  }, [canManageStore]);

  if (!canManageStore) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default RequireAdmin;
