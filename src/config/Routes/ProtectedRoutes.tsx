import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useLogout } from "../Api/useAuth";

export function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const { mutate: logout } = useLogout();

  useEffect(() => {
    const loginTime = localStorage.getItem("login_time");

    if (token && loginTime) {
      const currentTime = new Date().getTime();
      const loginTimestamp = new Date(loginTime).getTime();
      const timeDifference = currentTime - loginTimestamp;
      if (timeDifference > 60 * 60 * 1000) {
        logout();
      }
    }
  }, [token, logout]);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
