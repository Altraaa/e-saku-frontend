// src/config/Api/useAuth.ts
import { ApiAuth } from "../Services/Auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const login = async (credentials: {
    identifier: string;
    password: string;
  }) => {
    setErrorMessage(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      const data = await ApiAuth.login(credentials);

      localStorage.setItem("token", data.token);
      localStorage.setItem("login_time", new Date().toISOString());
      localStorage.setItem("last_activity", new Date().toISOString());

      if (data.user?.teacher_id) {
        localStorage.setItem("teacher_id", data.user.teacher_id);
        localStorage.setItem("user_type", "teacher");
      } else if (data.user?.student_id) {
        localStorage.setItem("student_id", data.user.student_id);
        localStorage.setItem("user_type", "student");
      }

      navigate("/");
      return data;
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.response) {
        const status = error.response.status;

        switch (status) {
          case 422:
            const errors = error.response.data.errors;
            const mappedErrors: Record<string, string> = {};
            Object.keys(errors).forEach((key) => {
              mappedErrors[key] = errors[key][0];
            });
            setFieldErrors(mappedErrors);
            break;
          case 401:
            setErrorMessage("Username atau password salah");
            break;
          case 404:
            setErrorMessage("User tidak ditemukan");
            break;
          default:
            setErrorMessage("Terjadi kesalahan pada server");
            break;
        }
      } else if (error.request) {
        setErrorMessage("Tidak ada respons dari server");
      } else {
        setErrorMessage("Terjadi kesalahan");
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    errorMessage,
    fieldErrors,
    setErrorMessage,
    setFieldErrors,
  };
};

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      // 1. First call the logout API while still authenticated
      await ApiAuth.logout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Even if API fails, proceed with client-side cleanup
    } finally {
      // 2. Clear all client-side storage
      localStorage.clear();

      // 3. Force hard redirect to ensure clean state
      window.location.href = "/login";
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
};

export const useCurrentUser = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");
  const teacherId = localStorage.getItem("teacher_id");
  const studentId = localStorage.getItem("student_id");

  return {
    isAuthenticated: !!token,
    userType,
    teacherId,
    studentId,
    isTeacher: userType === "teacher",
    isStudent: userType === "student",
  };
};
