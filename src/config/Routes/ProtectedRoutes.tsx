// src/config/ProtectedRoute.tsx
import { useEffect, useCallback, useState, useRef } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useLogout } from "../Api/useAuth";
import toast from "react-hot-toast";

export function ProtectedRoute() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { logout } = useLogout();
  const isLoggingOutRef = useRef(false);
  const lastTokenCheckRef = useRef(token);

  // Fungsi logout terpusat
  const performLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.", {
        duration: 5000,
        position: "top-center",
      });
      navigate("/login", { replace: true });
    }
  }, [logout, navigate]);

  // Fungsi untuk update last activity
  const updateLastActivity = useCallback(() => {
    localStorage.setItem("last_activity", new Date().toISOString());
  }, []);

  // Fungsi untuk handle aktivitas user
  const handleUserActivity = useCallback(() => {
    updateLastActivity();
  }, [updateLastActivity]);

  // Fungsi untuk cek sesi (inactivity)
  const checkSession = useCallback(() => {
    const lastActivity = localStorage.getItem("last_activity");
    if (lastActivity) {
      const currentTime = new Date().getTime();
      const lastActivityTime = new Date(lastActivity).getTime();
      const timeDifference = currentTime - lastActivityTime;

      // Logout jika tidak aktif selama 1 jam (3600000 ms)
      if (timeDifference > 60 * 60 * 1000) {
        toast.error("Sesi Anda telah berakhir karena tidak ada aktivitas.", {
          duration: 5000,
          position: "top-center",
        });
        return false;
      }
    }
    return true;
  }, []);

  // Pantau token di localStorage setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");

      // Deteksi perubahan token di tab yang sama
      if (lastTokenCheckRef.current !== currentToken) {
        lastTokenCheckRef.current = currentToken;
        setToken(currentToken);
      }

      // Trigger logout jika token dihapus
      if (!currentToken && token) {
        performLogout();
      }
    }, 500); // Periksa setiap 500ms

    return () => clearInterval(interval);
  }, [token, performLogout]);

  // Set activity listeners dan session check
  useEffect(() => {
    if (!token) {
      performLogout();
      return;
    }

    // Set last activity jika belum ada
    if (!localStorage.getItem("last_activity")) {
      updateLastActivity();
    }

    // Event listeners for user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const activityListeners = events.map((event) => {
      const listener = () => handleUserActivity();
      document.addEventListener(event, listener);
      return { event, listener };
    });

    // Check session periodically
    const sessionCheckInterval = setInterval(() => {
      if (!checkSession()) {
        performLogout();
      }
    }, 30 * 1000); // Check every 30 seconds

    return () => {
      activityListeners.forEach(({ event, listener }) => {
        document.removeEventListener(event, listener);
      });
      clearInterval(sessionCheckInterval);
    };
  }, [
    token,
    handleUserActivity,
    updateLastActivity,
    checkSession,
    performLogout,
  ]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        setToken(e.newValue || null);

        if (!e.newValue) {
          toast.error("Sesi Anda telah berakhir di tab lain.", {
            duration: 5000,
            position: "top-center",
          });
          performLogout();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [performLogout]);

  // Redirect jika token tidak ada
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
