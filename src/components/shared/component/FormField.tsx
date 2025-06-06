import React from "react";
import { Label } from "@/components/ui/label";

interface FormFieldGroupProps {
  label: React.ReactNode;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  error?: string;
}

export function FormFieldGroup({
  label,
  required,
  icon,
  children,
  error,
}: FormFieldGroupProps) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium flex items-center gap-2">
        {icon}
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default FormFieldGroup;