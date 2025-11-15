"use client";

import { CalendarDays, CheckCircle2, Circle, Clock } from "lucide-react";

interface TimelineItem {
  label: string;
  date: string;
  icon?: React.ReactNode;
  status?: "completed" | "current" | "upcoming";
  startDate?: string; // For items that have a duration (like fundraising period)
  endDate?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const getStatusText = (status: string, item: TimelineItem) => {
    if (status === "current") {
      // If it's a period (has both start and end), show "Đang diễn ra"
      if (item.startDate && item.endDate) {
        return "Đang diễn ra";
      }
      // If it's a single event happening now
      return "Đang thực hiện";
    }
    if (status === "completed") return "Hoàn thành";
    return null; // No badge for upcoming
  };

  return (
    <div className="relative">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const status = item.status || "upcoming";

        return (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 to-gray-200" />
            )}

            {/* Icon container */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${status === "completed"
                    ? "bg-green-500 text-white shadow-lg shadow-green-200"
                    : status === "current"
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-200 ring-4 ring-orange-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : status === "current" ? (
                  <Clock className="w-5 h-5 animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div
                className={`rounded-xl border p-4 transition-all duration-300 ${status === "completed"
                    ? "bg-gradient-to-br from-green-50 to-white border-green-200"
                    : status === "current"
                      ? "bg-gradient-to-br from-orange-50 to-white border-orange-300 shadow-md"
                      : "bg-white border-gray-200"
                  }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <h4
                    className={`font-semibold whitespace-nowrap ${status === "completed"
                        ? "text-green-900"
                        : status === "current"
                          ? "text-orange-900"
                          : "text-gray-700"
                      }`}
                  >
                    {item.label}
                  </h4>

                  {/* Status badge */}
                  {getStatusText(status, item) && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${status === "current"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                      }`}>
                      {getStatusText(status, item)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
