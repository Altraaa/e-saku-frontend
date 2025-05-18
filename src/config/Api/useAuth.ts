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
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};


export const useLogout = () => {
    const mutation = useMutation({
        mutationFn: ApiAuth.logout,
        onSuccess: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("teacher_id");
        },
        onError: (error) => {
            console.error("Logout failed:", error);
        },
    });

    return {
        logout: mutation.mutate,
        isSuccess: mutation.isSuccess,
    };
};
