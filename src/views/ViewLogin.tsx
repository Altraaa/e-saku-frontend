// src/pages/Login.tsx
import { Form, FormInput, FormButton } from "@/components/ui/form";
import esakulogo from "../assets/skensa.png";
import esakulogin from "../assets/esakulogin.jpg";
import { useEffect, useState } from "react";
import { useLogin } from "@/config/Api/useAuth";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function ViewLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, errorMessage, fieldErrors, setErrorMessage } =
    useLogin();

  const topLevelError =
    fieldErrors.password || fieldErrors.identifier || errorMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Username dan password harus diisi");
      return;
    }

    try {
      await login({ identifier, password });
    } catch (error) {
      console.error("Login Gagal:", error);
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement> | Date | undefined) => {
      if (!e || e instanceof Date) return;
      setter(e.target.value);
    };
  };

  useEffect(() => {
    const reason = localStorage.getItem("logout_reason");
    const success = localStorage.getItem("logout_success");
    const delay = 300;
    if (reason) {
      setTimeout(() => {
        toast.error(reason, {
          duration: 5000,
          position: "top-center",
        });
        localStorage.removeItem("logout_reason");
      }, delay);
      localStorage.removeItem("logout_reason");
    }
    if (success) {
      setTimeout(
        () => {
          toast.success(success, {
            duration: 5000,
            position: "top-center",
          });
          localStorage.removeItem("logout_success");
        },
        reason ? 3500 : delay
      );
      localStorage.removeItem("logout_success");
    }
  }, []);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col p-6">
        <div className="flex gap-2 items-center">
          <img src={esakulogo} alt="" width={35} />
          <span className="text-md font-semibold">E-Saku Peserta Didik</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form onSubmit={handleSubmit} isLoading={isLoading}>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Selamat Datang Kembali!</h1>
                <p className=" text-sm text-muted-foreground">
                  Masukan akun kamu untuk melanjutkan ke <br/>
                  E-Saku Peserta Didik.
                </p>
              </div>

              {topLevelError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {topLevelError}
                </div>
              )}

              <FormInput
                id="identifier"
                label="Username"
                value={identifier}
                onChange={handleInputChange(setIdentifier)}
                placeholder="Masukkan username anda"
                disabled={isLoading}
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="Masukkan password anda"
                disabled={isLoading}
              />

              <FormButton isLoading={isLoading}>Masuk</FormButton>

              <div className="text-center text-sm">
                Dengan masuk, Anda setuju dengan{" "} <br/>
                <a href="#" className="underline underline-offset-4">
                  Kebijakan & Privasi E-Saku
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={esakulogin}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
