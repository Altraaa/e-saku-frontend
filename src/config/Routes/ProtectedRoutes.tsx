import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import { useLogout } from "../Api/useAuth";

export function ProtectedRoute() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { logout } = useLogout();

  // Function to check auth status
  const checkAuthStatus = useCallback(() => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setToken(null);
      return false;
    }
    return true;
  }, []);

  // Function to update last activity time
  const updateLastActivity = useCallback(() => {
    localStorage.setItem("last_activity", new Date().toISOString());
  }, []);

  // Function to handle user activity
  const handleUserActivity = useCallback(() => {
    updateLastActivity();
  }, [updateLastActivity]);

  // Function to logout user
  const performLogout = useCallback(async () => {
    try {
      // Attempt API logout first
      await logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Clear all auth-related localStorage
      localStorage.clear();

      // Force redirect to login
      navigate("/login", { replace: true });
    }
  }, [logout, navigate]);

  // Check session validity
  const checkSession = useCallback(() => {
    if (!checkAuthStatus()) {
      performLogout();
      return false;
    }

    const lastActivity = localStorage.getItem("last_activity");
    if (lastActivity) {
      const currentTime = new Date().getTime();
      const lastActivityTime = new Date(lastActivity).getTime();
      const timeDifference = currentTime - lastActivityTime;

      // Logout if inactive for 1 hour (3600000 ms)
      if (timeDifference > 60 * 60 * 1000) {
        console.log("Session expired due to inactivity");
        performLogout();
        return false;
      }
    }
    return true;
  }, [checkAuthStatus, performLogout]);

  // Real-time local storage check
  useEffect(() => {
    const interval = setInterval(() => {
      const isAuthenticated = checkAuthStatus();
      if (!isAuthenticated) {
        performLogout();
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [checkAuthStatus, performLogout]);

  useEffect(() => {
    if (!token) {
      performLogout();
      return;
    }

    // Set initial last activity if not exists
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
      "click",
      "focus",
    ];

    const activityListeners = events.map((event) => {
      const listener = () => handleUserActivity();
      document.addEventListener(event, listener, true);
      return { event, listener };
    });

    // Check session periodically
    const sessionCheckInterval = setInterval(() => {
      checkSession();
    }, 30 * 1000); // Check every 30 seconds

    // Initial check
    const isValidSession = checkSession();
    if (!isValidSession) {
      return;
    }

    // Cleanup
    return () => {
      activityListeners.forEach(({ event, listener }) => {
        document.removeEventListener(event, listener, true);
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
      if (e.key === "token" && !e.newValue) {
        setToken(null);
        performLogout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [performLogout]);

  // Redirect if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
