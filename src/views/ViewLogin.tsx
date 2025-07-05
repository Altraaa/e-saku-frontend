// src/pages/Login.tsx
import { Form, FormInput, FormButton } from "@/components/ui/form";
import esakulogo from "../assets/skensa.png";
import esakulogin from "../assets/esakulogin.jpg";
import { useState } from "react";
import { useLogin } from "@/config/Api/useAuth";
import { AlertTriangle } from "lucide-react";

export default function ViewLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Use the manual login hook
  const { login, isLoading, errorMessage, setErrorMessage } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error before trying to login
    setErrorMessage(null);

    // Validate input
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Username dan password harus diisi");
      return;
    }

    try {
      await login({ identifier, password });
    } catch (error) {
      // Error handling is already done in the hook
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

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col p-6">
        <div className="flex gap-2 items-center">
          <img src={esakulogo} alt="" width={35} />
          <span className="text-md font-semibold">E-Saku Siswa</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form onSubmit={handleSubmit} isLoading={isLoading}>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Welcome Back!</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Enter your username for login to your account.
                </p>
              </div>

              {/* Show error message if exists */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {errorMessage}
                </div>
              )}

              <FormInput
                id="identifier"
                label="Username"
                value={identifier}
                onChange={handleInputChange(setIdentifier)}
                placeholder="Enter your username"
                disabled={isLoading}
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="Enter your password"
                disabled={isLoading}
              />

              <FormButton isLoading={isLoading}>Login</FormButton>

              <div className="text-center text-sm">
                By logging in, you agree to our{" "}
                <a href="#" className="underline underline-offset-4">
                  Privacy Policy
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
