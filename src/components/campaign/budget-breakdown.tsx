"use client";

import { formatCurrency } from "@/lib/utils/currency-utils";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const COLORS = [
  "#E77731", // Orange
  "#4F46E5", // Indigo
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
];

export function BudgetItem({
  title,
  amount,
  percent,
}: {
  title: string;
  amount: number;
  percent: number;
}) {
  const pct = clamp(Math.round(percent || 0), 0, 100);
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <span className="text-sm text-gray-500">{pct}%</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">
        {formatCurrency(amount || 0)}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-2 bg-[#E77731]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DonutChart({ items }: { items: Array<{ title: string; amount: number; percent: number }> }) {
  const size = 200;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Segments */}
        {items.map((item, index) => {
          const pct = clamp(item.percent || 0, 0, 100);
          const segmentLength = (pct / 100) * circumference;
          const segment = (
            <circle
              key={item.title}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={-currentOffset}
              className="transition-all duration-500"
            />
          );
          currentOffset += segmentLength;
          return segment;
        })}
      </svg>
      {/* Legend */}
      <div className="mt-6 space-y-2 w-full">
        {items.map((item, index) => {
          const pct = clamp(Math.round(item.percent || 0), 0, 100);
          return (
            <div key={item.title} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700 font-medium">{item.title}</span>
              </div>
              <span className="text-gray-600 font-semibold">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BudgetBreakdown({
  items,
}: {
  items: Array<{ title: string; amount: number; percent: number }>;
}) {
  if (!items?.length) return null;
  
  const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
      {/* Donut Chart */}
      <div className="flex items-center justify-center">
        <DonutChart items={items} />
      </div>
      
      {/* Budget Items */}
      <div className="space-y-4">
        <div className="mb-4 pb-4 border-b">
          <div className="text-sm text-gray-600 mb-1">Tổng ngân sách</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</div>
        </div>
        {items.map((it, index) => {
          const pct = clamp(Math.round(it.percent || 0), 0, 100);
          return (
            <div key={it.title} className="rounded-xl border p-4 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <h4 className="font-semibold text-gray-800">{it.title}</h4>
                </div>
                <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{pct}%</span>
              </div>
              <div className="text-lg font-bold text-gray-900 ml-4">
                {formatCurrency(it.amount || 0)}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-3 ml-4">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
