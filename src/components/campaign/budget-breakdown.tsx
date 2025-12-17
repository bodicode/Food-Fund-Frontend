"use client";

import { formatCurrency } from "../../lib/utils/currency-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Utensils, Leaf, MapPin, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../lib/utils/date-utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../../components/ui/badge";
import { CampaignPhase } from "../../types/api/phase";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const COLORS = [
  "#E77731",
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
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

// Local Phase interface removed in favor of CampaignPhase

function PlanDetails({ phase }: { phase: CampaignPhase }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMeals = phase.plannedMeals && phase.plannedMeals.length > 0;
  const hasIngredients = phase.plannedIngredients && phase.plannedIngredients.length > 0;

  if (!hasMeals && !hasIngredients) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
      >
        <span className="font-semibold text-gray-700 flex items-center gap-2">
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Thu gọn kế hoạch
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Xem chi tiết kế hoạch (Món ăn & Nguyên liệu)
            </>
          )}
        </span>
        {!isExpanded && (
          <div className="flex gap-3 text-xs text-gray-500">
            {hasMeals && <span>{phase.plannedMeals?.length} món ăn</span>}
            {hasIngredients && <span>{phase.plannedIngredients?.length} loại nguyên liệu</span>}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid md:grid-cols-2 gap-6">
              {/* Meals Column */}
              <div>
                <h5 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <div className="p-1 bg-orange-100 rounded-full">
                    <Utensils className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  Món ăn ({phase.plannedMeals?.length || 0})
                </h5>
                {hasMeals ? (
                  <ul className="space-y-2">
                    {phase.plannedMeals?.map((meal, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm p-2 rounded bg-orange-50/50 border border-orange-100">
                        <span className="font-medium text-gray-700">{meal.name}</span>
                        <Badge variant="secondary" className="bg-white text-orange-700 border-orange-200">
                          x{meal.quantity}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">Chưa có thông tin món ăn</p>
                )}
              </div>

              {/* Ingredients Column */}
              <div>
                <h5 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <div className="p-1 bg-green-100 rounded-full">
                    <Leaf className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  Nguyên liệu ({phase.plannedIngredients?.length || 0})
                </h5>
                {hasIngredients ? (
                  <ul className="space-y-2">
                    {phase.plannedIngredients?.map((ing, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm p-2 rounded bg-green-50/50 border border-green-100">
                        <span className="font-medium text-gray-700 truncate mr-2" title={ing.name}>{ing.name}</span>
                        <Badge variant="secondary" className="bg-white text-green-700 border-green-200 whitespace-nowrap">
                          {ing.quantity} {ing.unit}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">Chưa có thông tin nguyên liệu</p>
                )}
              </div>
            </div>

            {/* Extra Info */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 pt-4 border-t border-dashed">
              {phase.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {phase.location}
                </span>
              )}
              {phase.cookingDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> {formatDate(phase.cookingDate)}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BudgetBreakdown({
  phases,
  targetAmount,
}: {
  phases?: CampaignPhase[];
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h4 className="font-bold text-gray-900 mb-6 text-lg line-clamp-2 cursor-help text-left break-words">
                      {phase.phaseName}
                    </h4>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs break-words">{phase.phaseName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

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
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {phase.ingredientFundsAmount
                            ? `${Math.round(clamp((Number(phase.ingredientFundsAmount) / ((ingredientPct / 100) * targetAmount)) * 100, 0, 100))}%`
                            : '0%'
                          }
                        </span>
                      </div>
                      <div className="space-y-1 ml-3">
                        <div className="text-sm font-bold text-gray-900">
                          {phase.ingredientFundsAmount
                            ? `Đã nhận: ${formatCurrency(Number(phase.ingredientFundsAmount))}`
                            : `Dự kiến: ${formatCurrency((ingredientPct / 100) * targetAmount)}`
                          }
                        </div>
                        {phase.ingredientFundsAmount && (
                          <div className="text-xs text-gray-500">
                            Dự kiến: {formatCurrency((ingredientPct / 100) * targetAmount)}
                          </div>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2 ml-3">
                        <div className="h-1.5 bg-[#E77731] rounded-full" style={{ width: `${phase.ingredientFundsAmount ? clamp((Number(phase.ingredientFundsAmount) / ((ingredientPct / 100) * targetAmount)) * 100, 0, 100) : 0}%` }} />
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
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {phase.cookingFundsAmount
                            ? `${Math.round(clamp((Number(phase.cookingFundsAmount) / ((cookingPct / 100) * targetAmount)) * 100, 0, 100))}%`
                            : '0%'
                          }
                        </span>
                      </div>
                      <div className="space-y-1 ml-3">
                        <div className="text-sm font-bold text-gray-900">
                          {phase.cookingFundsAmount
                            ? `Đã nhận: ${formatCurrency(Number(phase.cookingFundsAmount))}`
                            : `Dự kiến: ${formatCurrency((cookingPct / 100) * targetAmount)}`
                          }
                        </div>
                        {phase.cookingFundsAmount && (
                          <div className="text-xs text-gray-500">
                            Dự kiến: {formatCurrency((cookingPct / 100) * targetAmount)}
                          </div>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2 ml-3">
                        <div className="h-1.5 bg-[#4F46E5] rounded-full" style={{ width: `${phase.cookingFundsAmount ? clamp((Number(phase.cookingFundsAmount) / ((cookingPct / 100) * targetAmount)) * 100, 0, 100) : 0}%` }} />
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
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {phase.deliveryFundsAmount
                            ? `${Math.round(clamp((Number(phase.deliveryFundsAmount) / ((deliveryPct / 100) * targetAmount)) * 100, 0, 100))}%`
                            : '0%'
                          }
                        </span>
                      </div>
                      <div className="space-y-1 ml-3">
                        <div className="text-sm font-bold text-gray-900">
                          {phase.deliveryFundsAmount
                            ? `Đã nhận: ${formatCurrency(Number(phase.deliveryFundsAmount))}`
                            : `Dự kiến: ${formatCurrency((deliveryPct / 100) * targetAmount)}`
                          }
                        </div>
                        {phase.deliveryFundsAmount && (
                          <div className="text-xs text-gray-500">
                            Dự kiến: {formatCurrency((deliveryPct / 100) * targetAmount)}
                          </div>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2 ml-3">
                        <div className="h-1.5 bg-[#10B981] rounded-full" style={{ width: `${phase.deliveryFundsAmount ? clamp((Number(phase.deliveryFundsAmount) / ((deliveryPct / 100) * targetAmount)) * 100, 0, 100) : 0}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Integrated Plan Details */}
              <PlanDetails phase={phase} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
