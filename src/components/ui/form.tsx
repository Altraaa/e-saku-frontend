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
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: React.ReactNode;
  isLoading?: boolean;
}

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value?: string | Date | null;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  required?: boolean;
}

interface FormTextareaProps {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
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
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

export function Form({ onSubmit, children }: FormProps) {
  return (
    <form
      onSubmit={onSubmit as (e: React.FormEvent<HTMLFormElement>) => void}
      className="flex flex-col gap-6"
    >
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
  onDateChange,
  disabled,
  required = true,
}: FormInputProps) {
  if (type === "date") {
    return (
      <DatePicker
        id={id}
        label={label}
        value={value}
        onChange={(date) => {
          // Handle date change and convert to expected format
          if (onChange) {
            const event = {
              target: {
                id,
                value: date ? date.toISOString().split("T")[0] : "",
              },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }

          // Also call onDateChange if provided
          if (onDateChange) {
            onDateChange(date);
          }
        }}
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
        value={
          typeof value === "string"
            ? value
            : value instanceof Date
            ? value.toISOString().split("T")[0]
            : ""
        }
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        required={required}
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
      <Select
        value={value}
        onValueChange={onChange ?? (() => {})}
        disabled={disabled}
      >
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

export function FormButton({ children, isLoading, onClick, type}: FormButtonProps) {
  return (
    <Button type={type} className="w-full" disabled={isLoading} onClick={onClick}>
      {isLoading ? "Loading..." : children}
    </Button>
  );
}
