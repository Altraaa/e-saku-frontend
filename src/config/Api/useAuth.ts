import { useMutation } from "@tanstack/react-query";
import { ApiAuth } from "../Services/Auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return {
    errorMessage,
    ...useMutation({
      mutationFn: ApiAuth.login,
      onSuccess: (data) => {
        // Reset error message
        setErrorMessage(null);

        // Set token dan login time
        localStorage.setItem("token", data.token);
        localStorage.setItem("login_time", new Date().toISOString());
        localStorage.setItem("last_activity", new Date().toISOString());

        // Set user-specific data
        if (data.user?.teacher_id) {
          localStorage.setItem("teacher_id", data.user.teacher_id);
          localStorage.setItem("user_type", "teacher");
        } else if (data.user?.student_id) {
          localStorage.setItem("student_id", data.user.student_id);
          localStorage.setItem("user_type", "student");
        }

        navigate("/");
      },
      onError: (error: any) => {
        console.error("Login failed:", error);

        // Set error message based on response
        if (error.response) {
          if (error.response.status === 401) {
            setErrorMessage("Username atau password salah");
          } else if (error.response.status === 404) {
            setErrorMessage("User tidak ditemukan");
          } else {
            setErrorMessage("Terjadi kesalahan pada server");
          }
        } else if (error.request) {
          setErrorMessage("Tidak ada respons dari server");
        } else {
          setErrorMessage("Terjadi kesalahan");
        }
      },
    }),
  };
};

export const useLogout = () => {
  return useMutation({
    mutationFn: ApiAuth.logout,
    onSuccess: () => {
      // Hapus semua data session untuk teacher dan student
      localStorage.removeItem("token");
      localStorage.removeItem("teacher_id");
      localStorage.removeItem("student_id");
      localStorage.removeItem("user_type");
      localStorage.removeItem("login_time");
      localStorage.removeItem("last_activity");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Tetap hapus local storage meskipun API gagal
      localStorage.removeItem("token");
      localStorage.removeItem("teacher_id");
      localStorage.removeItem("student_id");
      localStorage.removeItem("user_type");
      localStorage.removeItem("login_time");
      localStorage.removeItem("last_activity");
    },
  });
};

// Helper hook untuk mendapatkan user info
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
