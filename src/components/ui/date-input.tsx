"use client";

import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface DateInputProps {
  value: string; // ISO string
  onChange: (isoString: string) => void;
  placeholder?: string;
  className?: string;
  includeTime?: boolean;
}

export function DateInput({
  value,
  onChange,
  placeholder = "dd/MM/yyyy",
  className = "",
  includeTime = false,
}: DateInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Convert ISO to display format
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        
        if (includeTime) {
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          setDisplayValue(`${day}/${month}/${year} ${hours}:${minutes}`);
        } else {
          setDisplayValue(`${day}/${month}/${year}`);
        }
      }
    } else {
      setDisplayValue("");
    }
  }, [value, includeTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    // Parse dd/MM/yyyy HH:mm or dd/MM/yyyy
    const timePattern = includeTime
      ? /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})$/
      : /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    
    const match = input.match(timePattern);
    
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      
      if (includeTime) {
        const hours = parseInt(match[4], 10);
        const minutes = parseInt(match[5], 10);
        
        if (
          day >= 1 && day <= 31 &&
          month >= 1 && month <= 12 &&
          year >= 1900 &&
          hours >= 0 && hours <= 23 &&
          minutes >= 0 && minutes <= 59
        ) {
          // Create date in local timezone
          const date = new Date(year, month - 1, day, hours, minutes);
          if (!isNaN(date.getTime())) {
            onChange(date.toISOString());
          }
        }
      } else {
        if (
          day >= 1 && day <= 31 &&
          month >= 1 && month <= 12 &&
          year >= 1900
        ) {
          // Create date at noon to avoid timezone issues
          const date = new Date(year, month - 1, day, 12, 0, 0);
          if (!isNaN(date.getTime())) {
            onChange(date.toISOString());
          }
        }
      }
    }
  };

  const handleBlur = () => {
    // Reformat on blur if valid
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        
        if (includeTime) {
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          setDisplayValue(`${day}/${month}/${year} ${hours}:${minutes}`);
        } else {
          setDisplayValue(`${day}/${month}/${year}`);
        }
      }
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={includeTime ? "dd/MM/yyyy HH:mm" : placeholder}
        className={className}
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
