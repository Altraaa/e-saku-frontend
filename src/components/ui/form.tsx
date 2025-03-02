import { DatePicker } from "../shared/component/DatePicker";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./select";

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value?: string | Date;
  placeholder: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement> | Date | undefined
  ) => void;
  disabled?: boolean;
}

interface FormTextareaProps {
  id: string;
  label: string;
  value?: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

interface FormSelectProps {
  id: string;
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
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
  type = "text",
  value,
  placeholder,
  onChange,
  disabled,
}: FormInputProps) {
  if (type === "date") {
    return (
      <DatePicker
        id={id}
        label={label}
        onChange={(date) => onChange?.(date)}
        isForm={true}
      />
    );
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value as string}
        placeholder={placeholder}
        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        disabled={disabled}
        required
      />
    </div>
  );
}

export function FormTextarea({
  id,
  label,
  value,
  placeholder,
  onChange,
  disabled,
}: FormTextareaProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        required
      />
    </div>
  );
}

export function FormSelect({
  id,
  label,
  options,
  placeholder,
  value,
  onChange,
  disabled,
}: FormSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
