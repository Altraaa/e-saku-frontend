import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value?: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

interface FormButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Form({ onSubmit, children }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {children}
    </form>
  );
}

export function FormInput({
  id,
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  disabled,
}: FormInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        required
      />
    </div>
  );
}

export function FormButton({ children, isLoading }: FormButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Loading..." : children}
    </Button>
  );
}
