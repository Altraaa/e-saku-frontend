import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboBoxOption {
  value: string;
  label: string;
  id?: string | number;
  disabled?: boolean;
  [key: string]: any;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  value: string;
  onValueChange: (value: string, option?: ComboBoxOption) => void;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: string;
  className?: string;
  popoverClassName?: string;
  icon?: React.ReactNode;
  allowClear?: boolean;
  maxHeight?: string;
  loading?: boolean;
  renderOption?: (option: ComboBoxOption) => React.ReactNode;
  renderSelected?: (option: ComboBoxOption) => React.ReactNode;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari...",
  emptyMessage = "Tidak ada data yang ditemukan.",
  error,
  className,
  popoverClassName,
  icon,
  allowClear = false,
  maxHeight = "max-h-60",
  loading = false,
  renderOption,
  renderSelected,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filter = searchTerm.trim().toLowerCase();
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(filter)
  );

  const handleSelect = (selectedValue: string) => {
    const option = options.find((opt) => opt.value === selectedValue);
    if (selectedValue === value && allowClear) {
      onValueChange("", undefined);
    } else {
      onValueChange(selectedValue, option);
    }
    setOpen(false);
  };

  const renderSelectedContent = () => {
    if (selectedOption) {
      return renderSelected
        ? renderSelected(selectedOption)
        : selectedOption.label;
    }
    return placeholder;
  };

  const renderOptionContent = (option: ComboBoxOption) => {
    if (renderOption) {
      return renderOption(option);
    }
    return option.label;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg",
            error && "border-red-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled || loading}
        >
          <div className="flex items-center truncate">
            {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
            <span className="truncate">{renderSelectedContent()}</span>
          </div>
          <div className="flex items-center">
            <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-full p-0", popoverClassName)}
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className={cn("overflow-y-auto", maxHeight)}>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.id || option.value}
                value={option.value}
                onSelect={handleSelect}
                disabled={option.disabled}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {renderOptionContent(option)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
