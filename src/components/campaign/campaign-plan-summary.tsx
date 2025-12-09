"use client";

import { CampaignPhase } from "@/types/api/phase";
import { Utensils, Leaf, MapPin, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils/date-utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface CampaignPlanSummaryProps {
    phases: CampaignPhase[];
}

export function CampaignPlanSummary({ phases }: CampaignPlanSummaryProps) {
    if (!phases || phases.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-600" />
                    Kế hoạch thực hiện
                </h3>
                <p className="text-sm text-gray-600">
                    Chi tiết các món ăn và nguyên liệu dự kiến cho từng giai đoạn
                </p>
            </div>

            <div className="space-y-4">
                {phases.map((phase, index) => (
                    <PhasePlanItem key={phase.id || index} phase={phase} index={index} />
                ))}
            </div>
        </div>
    );
}

function PhasePlanItem({ phase, index }: { phase: CampaignPhase; index: number }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const hasMeals = phase.plannedMeals && phase.plannedMeals.length > 0;
    const hasIngredients = phase.plannedIngredients && phase.plannedIngredients.length > 0;

    if (!hasMeals && !hasIngredients) return null;

    return (
        <div className="border rounded-xl overflow-hidden bg-gray-50/50">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div>
                        <h4 className="font-semibold text-gray-900">{phase.phaseName}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {phase.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" /> {formatDate(phase.cookingDate)}
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 pt-0 border-t border-gray-100 bg-white">
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
