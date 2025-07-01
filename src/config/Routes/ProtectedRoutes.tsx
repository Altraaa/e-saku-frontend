import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import { useLogout } from "../Api/useAuth";

export function ProtectedRoute() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { mutate: logout } = useLogout();

  // Function untuk update last activity time
  const updateLastActivity = useCallback(() => {
    localStorage.setItem("last_activity", new Date().toISOString());
  }, []);

  // Function untuk handle user activity
  const handleUserActivity = useCallback(() => {
    updateLastActivity();
  }, [updateLastActivity]);

  // Function untuk logout user
  const performLogout = useCallback(() => {
    // Langsung set token ke null untuk trigger re-render
    setToken(null);

    // Bersihkan localStorage untuk semua user types
    localStorage.removeItem("token");
    localStorage.removeItem("teacher_id");
    localStorage.removeItem("student_id");
    localStorage.removeItem("user_type");
    localStorage.removeItem("login_time");
    localStorage.removeItem("last_activity");

    // Panggil API logout (optional, bisa gagal tapi tidak masalah)
    logout();

    // Force navigate dengan setTimeout untuk memastikan state sudah update
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  }, [logout, navigate]);

  useEffect(() => {
    if (!token) return;

    // Set initial last activity jika belum ada
    if (!localStorage.getItem("last_activity")) {
      updateLastActivity();
    }

    // Event listeners untuk detect user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "focus",
      "blur",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Check inactivity setiap 30 detik (lebih responsif)
    const checkInactivity = setInterval(() => {
      const currentToken = localStorage.getItem("token");

      // Double check token masih ada
      if (!currentToken) {
        setToken(null);
        return;
      }

      const lastActivity = localStorage.getItem("last_activity");

      if (lastActivity) {
        const currentTime = new Date().getTime();
        const lastActivityTime = new Date(lastActivity).getTime();
        const timeDifference = currentTime - lastActivityTime;

        // Logout jika tidak ada aktivitas selama 1 jam (3600000 ms)
        if (timeDifference > 60 * 60 * 1000) {
          console.log("Session expired due to inactivity");
          performLogout();
        }
      }
    }, 30 * 1000); // Check setiap 30 detik (lebih responsif)

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      clearInterval(checkInactivity);
    };
  }, [token, handleUserActivity, updateLastActivity, performLogout]);

  // Listen untuk perubahan localStorage dari tab lain
  useEffect(() => {
    const handleStorageChange = (e: any) => {
      if (e.key === "token" && !e.newValue) {
        setToken(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Navigasi manual jika token tidak ada
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
