"use client";

import { useEffect, useState } from "react";
import { mealBatchService } from "@/services/meal-batch.service";
import { MealBatch } from "@/types/api/meal-batch";
import { formatDateTime } from "@/lib/utils/date-utils";
import { translateStatus, getStatusColorClass } from "@/lib/utils/status-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MealBatchDetailDialog } from "@/components/campaign/meal-batch-detail-dialog";
import {
    UtensilsCrossed,
    Calendar,
    User,
    Package,
    Eye,
} from "lucide-react";

interface MealBatchListProps {
    campaignId: string;
}

export function MealBatchList({ campaignId }: MealBatchListProps) {
    const [mealBatches, setMealBatches] = useState<MealBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMealBatchId, setSelectedMealBatchId] = useState<string | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    useEffect(() => {
        fetchMealBatches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignId]);

    const fetchMealBatches = async () => {
        setLoading(true);
        try {
            const data = await mealBatchService.getMealBatches({
                filter: { campaignId },
            });
            setMealBatches(data);
        } catch (error) {
            console.error("Error fetching meal batches:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const label = translateStatus(status);
        const colorClass = getStatusColorClass(status);

        return (
            <Badge className={`${colorClass} text-xs`}>
                {label}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
            </div>
        );
    }

    if (mealBatches.length === 0) {
        return (
            <div className="text-center py-12">
                <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có thức ăn nào được nấu</p>
                <p className="text-sm text-gray-400 mt-1">
                    Các món ăn sẽ được hiển thị sau khi đội ngũ bếp hoàn thành
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Thức ăn đã nấu ({mealBatches.length})
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Danh sách các món ăn đã được chuẩn bị cho chiến dịch
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mealBatches.map((batch) => (
                        <div
                            key={batch.id}
                            className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <UtensilsCrossed className="w-5 h-5 text-[#E77731]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{batch.foodName}</h4>
                                    </div>
                                </div>
                                {getStatusBadge(batch.status)}
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Package className="w-4 h-4" />
                                    <span>Số lượng: <strong className="text-gray-900">{batch.quantity} suất</strong></span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span>Người nấu: <strong className="text-gray-900">{batch.kitchenStaff.full_name}</strong></span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDateTime(batch.cookedDate)}</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedMealBatchId(batch.id);
                                    setDetailDialogOpen(true);
                                }}
                                className="w-full"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Xem chi tiết
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMealBatchId && (
                <MealBatchDetailDialog
                    mealBatchId={selectedMealBatchId}
                    open={detailDialogOpen}
                    onOpenChange={setDetailDialogOpen}
                />
            )}
        </>
    );
}
