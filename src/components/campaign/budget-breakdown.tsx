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
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;

  return (
    <div className="flex flex-col items-center w-full max-w-[160px]">
      <svg width={size} height={size} className="transform -rotate-90 shrink-0">
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
      <div className="mt-4 space-y-1.5 w-full">
        {items.map((item, index) => {
          const pct = clamp(Math.round(item.percent || 0), 0, 100);
          return (
            <div key={item.title} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
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

interface Phase {
  id: string;
  phaseName: string;
  ingredientBudgetPercentage?: string;
  cookingBudgetPercentage?: string;
  deliveryBudgetPercentage?: string;
}

export function BudgetBreakdown({
  phases,
  targetAmount,
}: {
  phases?: Phase[];
  targetAmount?: number;
}) {
  if (!phases || phases.length === 0 || !targetAmount) return null;
  
  return (
    <div className="space-y-8">
      {/* Budget by Phase */}
      <div className="space-y-8">
            {phases.map((phase) => {
              const ingredientPct = Number(phase.ingredientBudgetPercentage || 0);
              const cookingPct = Number(phase.cookingBudgetPercentage || 0);
              const deliveryPct = Number(phase.deliveryBudgetPercentage || 0);
              const totalPhasePct = ingredientPct + cookingPct + deliveryPct;
              const totalPhaseAmount = (totalPhasePct / 100) * targetAmount;

              if (totalPhasePct === 0) return null;

              const phaseItems = [
                ingredientPct > 0 && { title: "Nguyên liệu", amount: (ingredientPct / 100) * targetAmount, percent: ingredientPct },
                cookingPct > 0 && { title: "Nấu ăn", amount: (cookingPct / 100) * targetAmount, percent: cookingPct },
                deliveryPct > 0 && { title: "Vận chuyển", amount: (deliveryPct / 100) * targetAmount, percent: deliveryPct },
              ].filter(Boolean) as Array<{ title: string; amount: number; percent: number }>;

              return (
                <div key={phase.id} className="rounded-xl border p-6 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-6 text-lg">{phase.phaseName}</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 items-start">
                    {/* Mini Donut Chart */}
                    <div className="flex items-center justify-center">
                      <DonutChart items={phaseItems} />
                    </div>

                    {/* Budget Details */}
                    <div className="space-y-4">
                      <div className="mb-4 pb-3 border-b">
                        <div className="text-xs text-gray-600 mb-1">Tổng giai đoạn</div>
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(totalPhaseAmount)}</div>
                      </div>

                      {ingredientPct > 0 && (
                        <div className="rounded-lg border p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-0.5 h-6 rounded-full bg-[#E77731]" />
                              <span className="text-sm font-medium text-gray-700">Nguyên liệu</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{ingredientPct}%</span>
                          </div>
                          <div className="text-sm font-bold text-gray-900 ml-3">
                            {formatCurrency((ingredientPct / 100) * targetAmount)}
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2 ml-3">
                            <div className="h-1.5 bg-[#E77731] rounded-full" style={{ width: `${ingredientPct}%` }} />
                          </div>
                        </div>
                      )}

                      {cookingPct > 0 && (
                        <div className="rounded-lg border p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-0.5 h-6 rounded-full bg-[#4F46E5]" />
                              <span className="text-sm font-medium text-gray-700">Nấu ăn</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{cookingPct}%</span>
                          </div>
                          <div className="text-sm font-bold text-gray-900 ml-3">
                            {formatCurrency((cookingPct / 100) * targetAmount)}
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2 ml-3">
                            <div className="h-1.5 bg-[#4F46E5] rounded-full" style={{ width: `${cookingPct}%` }} />
                          </div>
                        </div>
                      )}

                      {deliveryPct > 0 && (
                        <div className="rounded-lg border p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-0.5 h-6 rounded-full bg-[#10B981]" />
                              <span className="text-sm font-medium text-gray-700">Vận chuyển</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{deliveryPct}%</span>
                          </div>
                          <div className="text-sm font-bold text-gray-900 ml-3">
                            {formatCurrency((deliveryPct / 100) * targetAmount)}
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2 ml-3">
                            <div className="h-1.5 bg-[#10B981] rounded-full" style={{ width: `${deliveryPct}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
