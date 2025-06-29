import { useMutation } from "@tanstack/react-query";
import { ApiAuth } from "../Services/Auth.service";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ApiAuth.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("teacher_id", data.user?.teacher_id);
      localStorage.setItem("login_time", new Date().toISOString());
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};


export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ApiAuth.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("teacher_id");
      navigate("/login"); 
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
