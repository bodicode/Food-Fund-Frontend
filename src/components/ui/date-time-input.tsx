"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Clock } from "lucide-react";

interface DateTimeInputProps {
  value: string; // ISO string
  onChange: (isoString: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimeInput({
  value,
  onChange,
  className = "",
}: DateTimeInputProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  // Parse ISO string to individual fields
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setDay(String(date.getDate()).padStart(2, "0"));
        setMonth(String(date.getMonth() + 1).padStart(2, "0"));
        setYear(String(date.getFullYear()));
        setHour(String(date.getHours()).padStart(2, "0"));
        setMinute(String(date.getMinutes()).padStart(2, "0"));
      }
    }
  }, [value]);

  // Update ISO string when fields change
  const updateISOString = (d: string, m: string, y: string, h: string, min: string) => {
    const dayNum = parseInt(d, 10);
    const monthNum = parseInt(m, 10);
    const yearNum = parseInt(y, 10);
    const hourNum = parseInt(h, 10);
    const minuteNum = parseInt(min, 10);

    if (
      d.length === 2 &&
      m.length === 2 &&
      y.length === 4 &&
      h.length === 2 &&
      min.length === 2 &&
      dayNum >= 1 &&
      dayNum <= 31 &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      yearNum >= 1900 &&
      hourNum >= 0 &&
      hourNum <= 23 &&
      minuteNum >= 0 &&
      minuteNum <= 59
    ) {
      const date = new Date(yearNum, monthNum - 1, dayNum, hourNum, minuteNum);
      if (!isNaN(date.getTime())) {
        onChange(date.toISOString());
      }
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2);
    
    // Only validate when 2 digits are entered
    if (val.length === 2) {
      const num = parseInt(val, 10);
      if (num < 1) {
        val = "01";
      } else if (num > 31) {
        val = "31";
      }
    }
    
    setDay(val);
    updateISOString(val, month, year, hour, minute);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2);
    
    // Only validate when 2 digits are entered
    if (val.length === 2) {
      const num = parseInt(val, 10);
      if (num < 1) {
        val = "01";
      } else if (num > 12) {
        val = "12";
      }
    }
    
    setMonth(val);
    updateISOString(day, val, year, hour, minute);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    
    // Only validate when 4 digits are entered
    if (val.length === 4) {
      const num = parseInt(val, 10);
      if (num < 1900) {
        val = "1900";
      } else if (num > 2100) {
        val = "2100";
      }
    }
    
    setYear(val);
    updateISOString(day, month, val, hour, minute);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2);
    
    // Only validate when 2 digits are entered
    if (val.length === 2) {
      const num = parseInt(val, 10);
      if (num > 23) {
        val = "23";
      }
    }
    
    setHour(val);
    updateISOString(day, month, year, val, minute);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2);
    
    // Only validate when 2 digits are entered
    if (val.length === 2) {
      const num = parseInt(val, 10);
      if (num > 59) {
        val = "59";
      }
    }
    
    setMinute(val);
    updateISOString(day, month, year, hour, val);
  };

  const handleDayBlur = () => {
    if (day.length === 1) {
      setDay("0" + day);
    }
  };

  const handleMonthBlur = () => {
    if (month.length === 1) {
      setMonth("0" + month);
    }
  };

  const handleHourBlur = () => {
    if (hour.length === 1) {
      setHour("0" + hour);
    }
  };

  const handleMinuteBlur = () => {
    if (minute.length === 1) {
      setMinute("0" + minute);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentRef: React.RefObject<HTMLInputElement | null>,
    nextRef: React.RefObject<HTMLInputElement | null> | null,
    prevRef: React.RefObject<HTMLInputElement | null> | null
  ) => {
    // Tab or Enter to next field
    if ((e.key === "Tab" || e.key === "Enter") && !e.shiftKey && nextRef) {
      const current = currentRef.current;
      if (current && current.value.length > 0) {
        e.preventDefault();
        nextRef.current?.focus();
      }
    }
    // Shift+Tab to previous field
    else if (e.key === "Tab" && e.shiftKey && prevRef) {
      e.preventDefault();
      prevRef.current?.focus();
    }
    // Backspace on empty field goes to previous
    else if (e.key === "Backspace" && currentRef.current?.value === "" && prevRef) {
      e.preventDefault();
      prevRef.current?.focus();
    }
  };

  return (
    <div className={`flex items-center gap-1.5 border rounded-md px-2.5 py-2 bg-white text-sm ${className}`}>
      <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      
      {/* Date inputs */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <input
          ref={dayRef}
          type="text"
          inputMode="numeric"
          value={day}
          onChange={handleDayChange}
          onBlur={handleDayBlur}
          onKeyDown={(e) => handleKeyDown(e, dayRef, monthRef, null)}
          placeholder="dd"
          className="w-6 text-center outline-none bg-transparent text-sm"
          maxLength={2}
        />
        <span className="text-gray-400 text-xs">/</span>
        <input
          ref={monthRef}
          type="text"
          inputMode="numeric"
          value={month}
          onChange={handleMonthChange}
          onBlur={handleMonthBlur}
          onKeyDown={(e) => handleKeyDown(e, monthRef, yearRef, dayRef)}
          placeholder="mm"
          className="w-6 text-center outline-none bg-transparent text-sm"
          maxLength={2}
        />
        <span className="text-gray-400 text-xs">/</span>
        <input
          ref={yearRef}
          type="text"
          inputMode="numeric"
          value={year}
          onChange={handleYearChange}
          onKeyDown={(e) => handleKeyDown(e, yearRef, hourRef, monthRef)}
          placeholder="yyyy"
          className="w-10 text-center outline-none bg-transparent text-sm"
          maxLength={4}
        />
      </div>

      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      
      {/* Time inputs */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          value={hour}
          onChange={handleHourChange}
          onBlur={handleHourBlur}
          onKeyDown={(e) => handleKeyDown(e, hourRef, minuteRef, yearRef)}
          placeholder="HH"
          className="w-6 text-center outline-none bg-transparent text-sm"
          maxLength={2}
        />
        <span className="text-gray-400 text-xs">:</span>
        <input
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          value={minute}
          onChange={handleMinuteChange}
          onBlur={handleMinuteBlur}
          onKeyDown={(e) => handleKeyDown(e, minuteRef, null, hourRef)}
          placeholder="mm"
          className="w-6 text-center outline-none bg-transparent text-sm"
          maxLength={2}
        />
      </div>
    </div>
  );
}
