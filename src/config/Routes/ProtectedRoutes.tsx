// src/config/ProtectedRoute.tsx
import { useEffect, useCallback, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLogout } from "../Api/useAuth";

export function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const { logout } = useLogout();

  const isLoggingOutRef = useRef(false);
  const activityTimeout = useRef<NodeJS.Timeout | null>(null);

  const performLogout = useCallback(
    async (message = "Sesi Anda telah berakhir.") => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;

      await logout();
      localStorage.setItem("logout_message", message);
    },
    [logout]
  );

  const resetInactivityTimer = useCallback(() => {
    localStorage.setItem("last_activity", new Date().toISOString());

    if (activityTimeout.current) clearTimeout(activityTimeout.current);

    activityTimeout.current = setTimeout(() => {
      performLogout("Sesi Anda telah berakhir karena tidak ada aktivitas.");
    }, 60 * 60 * 1000); 
  }, [performLogout]);

  useEffect(() => {
    if (!token) return;

    resetInactivityTimer();

    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];
    const listener = () => resetInactivityTimer();

    events.forEach((e) => window.addEventListener(e, listener));

    return () => {
      events.forEach((e) => window.removeEventListener(e, listener));
      if (activityTimeout.current) clearTimeout(activityTimeout.current);
    };
  }, [token, resetInactivityTimer]);

  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        performLogout("Sesi Anda telah berakhir di tab lain.");
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [performLogout]);

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
}
