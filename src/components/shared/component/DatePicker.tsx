import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  id?: string;
  label?: string;
  value?: Date | string | null;
  onChange?: (date: Date | undefined) => void;
  isForm?: boolean;
}

export function DatePicker({
  id,
  label,
  value,
  onChange,
  isForm = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined;

    if (typeof value === "string") {
      const dateObj = new Date(value);
      return isNaN(dateObj.getTime()) ? undefined : dateObj;
    }

    return value instanceof Date ? value : undefined;
  });

  React.useEffect(() => {
    if (!value) {
      setDate(undefined);
      return;
    }

    if (typeof value === "string") {
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        setDate(dateObj);
      }
    } else if (value instanceof Date) {
      setDate(value);
    }
  }, [value]);

  const handleDateChange = (selectedDate?: Date) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate);
    }
  };

  return (
    <div className={cn(isForm && "grid gap-2 w-full")}>
      {isForm && label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
