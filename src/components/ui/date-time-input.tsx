"use client";

import * as React from "react";
import { format, startOfToday } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils/utils";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { ScrollArea } from "./scroll-area";

interface DateTimeInputProps {
  value: string; // ISO string like 2023-10-25T14:30:00
  onChange: (isoString: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimeInput({
  value,
  onChange,
  className = "",
  placeholder = "Chọn ngày và giờ"
}: DateTimeInputProps) {
  const [open, setOpen] = React.useState(false);
  const today = startOfToday();

  // Manual body scroll lock like in meal-batch-detail-dialog.tsx
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // document.body.style.paddingRight = "10px"; // Optional: handle scrollbar shift
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  // Helper to parse local ISO strings (YYYY-MM-DDTHH:mm) safely
  const parseISOToDate = (iso: string): Date | undefined => {
    if (!iso) return undefined;
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) {
      return new Date(
        parseInt(match[1]),
        parseInt(match[2]) - 1,
        parseInt(match[3]),
        parseInt(match[4]),
        parseInt(match[5])
      );
    }
    const d = new Date(iso);
    return isNaN(d.getTime()) ? undefined : d;
  };

  // Helper to format Date to local ISO string (YYYY-MM-DDTHH:mm:00)
  const formatDateToISO = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d}T${h}:${min}:00`;
  };

  const [date, setDate] = React.useState<Date | undefined>(parseISOToDate(value));

  React.useEffect(() => {
    setDate(parseISOToDate(value));
  }, [value]);

  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) return;
    const newDate = date ? new Date(date) : new Date();
    newDate.setFullYear(selectedDay.getFullYear());
    newDate.setMonth(selectedDay.getMonth());
    newDate.setDate(selectedDay.getDate());

    // Default time to current hour if new
    if (!date) {
      newDate.setHours(new Date().getHours(), 0, 0, 0);
    }

    setDate(newDate);
    onChange(formatDateToISO(newDate));
  };

  const handleTimeChange = (type: "hour" | "minute", val: number) => {
    const newDate = date ? new Date(date) : new Date();
    if (type === "hour") {
      newDate.setHours(val);
    } else {
      newDate.setMinutes(val);
    }
    setDate(newDate);
    onChange(formatDateToISO(newDate));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal h-11 px-3 border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all rounded-lg",
            !date && "text-gray-400",
            className
          )}
        >
          <div className="flex items-center overflow-hidden">
            <CalendarIcon className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">
              {date ? (
                <span className="text-gray-900 font-medium">
                  {format(date, "dd/MM/yyyy HH:mm", { locale: vi })}
                </span>
              ) : (
                <span>{placeholder}</span>
              )}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-fit p-0 shadow-2xl border-blue-100 rounded-xl overflow-hidden z-50 gap-0"
        showCloseButton={false}
        onWheel={(e: React.WheelEvent) => e.stopPropagation()}
      >
        <DialogHeader className="hidden">
          <DialogTitle>{placeholder}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row bg-white">
          <div className="p-2 border-r border-gray-50">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              locale={vi}
              className="rounded-md border-none"
              disabled={(d: Date) => d <= today}
            />
          </div>
          <div className="flex flex-col border-t md:border-t-0 bg-gray-50/30 w-[160px]">
            <div className="flex items-center justify-center py-3 border-b border-gray-100 bg-white shadow-sm">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">Thời gian</span>
            </div>
            <div className="flex h-[300px] overflow-hidden">
              <ScrollArea className="flex-1 h-full border-r border-gray-100 [&>[data-radix-scroll-area-viewport]]:overscroll-contain">
                <div className="flex flex-col p-2 min-h-min">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <Button
                      key={i}
                      variant={date?.getHours() === i ? "default" : "ghost"}
                      className={cn(
                        "h-9 w-full mb-1 text-sm font-medium rounded-md justify-center px-0 shrink-0",
                        date?.getHours() === i
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                      )}
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        handleTimeChange("hour", i);
                      }}
                    >
                      {i.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              <ScrollArea className="flex-1 h-full [&>[data-radix-scroll-area-viewport]]:overscroll-contain">
                <div className="flex flex-col p-2 min-h-min">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <Button
                      key={i}
                      variant={date?.getMinutes() === i ? "default" : "ghost"}
                      className={cn(
                        "h-9 w-full mb-1 text-sm font-medium rounded-md justify-center px-0 shrink-0",
                        date?.getMinutes() === i
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                      )}
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        handleTimeChange("minute", i);
                      }}
                    >
                      {i.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <Button size="sm" onClick={() => setOpen(false)} className="bg-blue-600 hover:bg-blue-700">
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
