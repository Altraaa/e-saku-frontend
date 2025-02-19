// src/pages/Login.tsx
import { Form, FormInput, FormButton } from "@/components/ui/form";
import esakulogo from "../assets/skensa.png";
import esakulogin from "../assets/esakulogin.jpg";

export default function ViewLogin() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
              <FormInput
                id="username"
                label="Username"
                type="text"
                placeholder="Enter your Username"
              />
              <FormInput
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <FormButton>Login</FormButton>
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
