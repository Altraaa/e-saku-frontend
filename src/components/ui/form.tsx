// src/components/ui/form.tsx
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

type FormProps = {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
};

type FormInputProps = {
    id: string;
    label: string; 
    type: string;
    placeholder: string;
}

type FormButtonProps = {
    children: React.ReactNode
}

export function Form({ onSubmit, children }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {children}
    </form>
  );
}

export function FormInput({ id, label, type = "text", placeholder }: FormInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} required />
    </div>
  );
}

export function FormButton({ children }: FormButtonProps) {
  return (
    <Button type="submit" className="w-full">
      {children}
    </Button>
  );
}
