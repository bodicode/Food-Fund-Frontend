import { CalendarDays } from "lucide-react";

export function DateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3 bg-white">
      <div className="flex items-center gap-2 text-gray-700">
        <CalendarDays className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
