import { useMutation } from "@tanstack/react-query";
import { ApiAuth } from "../Services/Auth.service";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ApiAuth.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      console.log("Login successful");
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ApiAuth.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      console.log("Logout successful");
      navigate("/login"); // Redirect ke halaman login setelah logout
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return {
    logout: mutation.mutate,
  }
};
