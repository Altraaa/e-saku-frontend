// src/pages/Login.tsx
import { Form, FormInput, FormButton } from "@/components/ui/form";
import esakulogo from "../assets/skensa.png";
import esakulogin from "../assets/esakulogin.jpg";
import { useState } from "react";
import { useLogin } from "@/config/Api/useAuth";

export default function ViewLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ identifier, password });
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
            <Form onSubmit={handleSubmit} isLoading={loginMutation.isPending}>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Welcome Back!</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Enter your username for login to your account.
                </p>
              </div>
              <FormInput
                id="identifier"
                label="Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your username"
                disabled={loginMutation.isPending}
              />
              <FormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loginMutation.isPending}
              />
              <FormButton isLoading={loginMutation.isPending}>Login</FormButton>
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
