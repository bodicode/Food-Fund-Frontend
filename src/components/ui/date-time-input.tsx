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
            "w-full justify-between text-left font-normal h-11 px-3 border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all rounded-xl shadow-none focus-visible:ring-1 focus-visible:ring-blue-100",
            !date && "text-gray-300",
            className
          )}
        >
          <div className="flex items-center overflow-hidden">
            <CalendarIcon className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="truncate">
              {date ? (
                <span className="text-gray-700 font-bold text-sm">
                  {format(date, "dd/MM/yyyy HH:mm", { locale: vi })}
                </span>
              ) : (
                <span className="text-xs font-semibold">{placeholder}</span>
              )}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-fit p-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-gray-100 rounded-3xl overflow-hidden z-50 gap-0"
        showCloseButton={false}
        onWheel={(e: React.WheelEvent) => e.stopPropagation()}
      >
        <DialogHeader className="hidden">
          <DialogTitle>{placeholder}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row bg-white">
          <div className="p-4 border-r border-gray-50 flex flex-col">
            <div className="mb-2 px-2 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chọn ngày</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] font-bold text-blue-600 h-6 px-2 hover:bg-blue-50"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  handleDateSelect(tomorrow);
                }}
              >
                Ngày mai
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              locale={vi}
              className="p-1"
              disabled={(d: Date) => d <= today}
              classNames={{
                root: "w-full",
                month: "w-full space-y-4",
                table: "w-full border-collapse space-y-1",
              }}
              modifiersClassNames={{
                selected: "!bg-blue-600 !text-white !rounded-xl shadow-lg shadow-blue-100 hover:!bg-blue-600 hover:!text-white"
              }}
            />
          </div>
          <div className="flex flex-col border-t md:border-t-0 bg-gray-50/20 w-[180px]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-50 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Thời gian</span>
              </div>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {date ? format(date, "HH:mm") : "--:--"}
              </span>
            </div>
            <div className="flex h-[320px] overflow-hidden">
              <ScrollArea className="flex-1 h-full border-r border-gray-50 [&>[data-radix-scroll-area-viewport]]:overscroll-contain bg-white/50">
                <div className="flex flex-col p-2 min-h-min">
                  <div className="text-[9px] font-bold text-gray-300 text-center mb-1 py-1 sticky top-0 bg-white z-10">GIỜ</div>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className={cn(
                        "h-10 w-full mb-1 text-sm font-bold rounded-xl justify-center transition-all",
                        date?.getHours() === i
                          ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-100"
                          : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
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
              <ScrollArea className="flex-1 h-full [&>[data-radix-scroll-area-viewport]]:overscroll-contain bg-white/50">
                <div className="flex flex-col p-2 min-h-min">
                  <div className="text-[9px] font-bold text-gray-300 text-center mb-1 py-1 sticky top-0 bg-white z-10">PHÚT</div>
                  {Array.from({ length: 60 }).map((_, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className={cn(
                        "h-10 w-full mb-1 text-sm font-bold rounded-xl justify-center transition-all",
                        date?.getMinutes() === i
                          ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-100"
                          : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
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
        <div className="p-4 border-t border-gray-50 bg-white flex items-center justify-between">
          <p className="text-[10px] text-gray-400 font-medium italic">
            * Chọn ngày trước khi chỉnh giờ
          </p>
          <Button
            size="sm"
            onClick={() => {
              if (!date) handleDateSelect(new Date());
              setOpen(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
