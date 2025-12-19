"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { mealBatchService } from "../../services/meal-batch.service";
import { MealBatch } from "../../types/api/meal-batch";
import { formatDateTime } from "../../lib/utils/date-utils";
import { translateStatus, getStatusColorClass } from "../../lib/utils/status-utils";
import { Loader } from "../../components/animate-ui/icons/loader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { MealBatchDetailDialog } from "../../components/campaign/meal-batch-detail-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
    UtensilsCrossed,
    Calendar,
    User,
    Package,
    ChevronRight,
    ChefHat,
    TrendingUp,
    Camera,
    Play
} from "lucide-react";

interface MealBatchListProps {
    campaignId?: string;
    campaignPhaseId?: string;
}

export function MealBatchList({ campaignId, campaignPhaseId }: MealBatchListProps) {
    const [mealBatches, setMealBatches] = useState<MealBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMealBatchId, setSelectedMealBatchId] = useState<string | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [openLightboxFirst, setOpenLightboxFirst] = useState(false);
    const [initialMediaIndex, setInitialMediaIndex] = useState(0);

    const fetchMealBatches = useCallback(async () => {
        setLoading(true);
        try {
            const data = await mealBatchService.getMealBatches({
                filter: {
                    campaignId: campaignPhaseId ? null : (campaignId || null),
                    campaignPhaseId: campaignPhaseId || null,
                    status: null,
                    kitchenStaffId: null
                },
            });
            setMealBatches(data || []);
        } catch (error) {
            console.error("Error fetching meal batches:", error);
        } finally {
            setLoading(false);
        }
    }, [campaignId, campaignPhaseId]);

    useEffect(() => {
        fetchMealBatches();
    }, [fetchMealBatches]);

    const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|quicktime)$/i.test(url) || url.includes("video");

    const getStatusBadge = (status: string) => {
        const label = translateStatus(status);
        const colorClass = getStatusColorClass(status);

        return (
            <Badge variant="outline" className={`${colorClass} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-current/20 bg-current/5 whitespace-nowrap`}>
                {label}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30 rounded-3xl border border-dashed border-gray-200">
                <Loader className="w-10 h-10 animate-spin text-[#ad4e28]" />
                <p className="mt-4 text-sm font-medium text-gray-400 animate-pulse uppercase tracking-widest">Đang tải danh sách...</p>
            </div>
        );
    }

    if (mealBatches.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm"
            >
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UtensilsCrossed className="w-10 h-10 text-orange-200" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Chưa có bản ghi nấu ăn</h4>
                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                    Các món ăn sẽ xuất hiện tại đây sau khi đội ngũ bếp hoàn tất quy trình chuẩn bị.
                </p>
                <div className="mt-8 flex items-center justify-center gap-2 text-[#ad4e28] text-xs font-bold uppercase tracking-tighter cursor-help">
                    <ChefHat className="w-4 h-4" />
                    <span>Đội ngũ bếp đang nỗ lực</span>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5 text-[#ad4e28]">
                            <UtensilsCrossed className="w-5 h-5" />
                            <h3 className="text-lg font-black tracking-tight uppercase">
                                Thức ăn đã chuẩn bị
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Báo cáo chi tiết quá trình chuẩn bị thực phẩm dự án</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <AnimatePresence mode="popLayout">
                        {mealBatches.map((batch, index) => (
                            <motion.div
                                key={batch.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white border border-gray-100 rounded-[2rem] p-4 sm:p-6 hover:shadow-[0_30px_60px_rgba(173,78,40,0.08)] hover:border-orange-100 transition-all duration-500 overflow-hidden"
                            >
                                {/* Decorative background accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50/50 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                    {/* Food Image Wrapper */}
                                    <div className="relative shrink-0 self-center md:self-stretch w-full md:w-48 lg:w-56 aspect-[4/3] md:aspect-square">
                                        {batch.media && batch.media.length > 0 ? (
                                            <div
                                                className="w-full h-full relative rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => {
                                                    setSelectedMealBatchId(batch.id);
                                                    setInitialMediaIndex(0);
                                                    setOpenLightboxFirst(true);
                                                    setDetailDialogOpen(true);
                                                }}
                                            >
                                                {isVideo(batch.media[0]) ? (
                                                    <div className="w-full h-full relative">
                                                        <video
                                                            src={batch.media[0]}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            muted
                                                            playsInline
                                                            onMouseOver={(e: React.MouseEvent<HTMLVideoElement>) => e.currentTarget.play()}
                                                            onMouseOut={(e: React.MouseEvent<HTMLVideoElement>) => {
                                                                e.currentTarget.pause();
                                                                e.currentTarget.currentTime = 0;
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                                                            <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40">
                                                                <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-white text-[10px] font-bold">
                                                            <Play className="w-3 h-3" />
                                                            Video
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full relative">
                                                        <Image
                                                            src={batch.media[0]}
                                                            alt={batch.foodName}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-white text-[10px] font-bold">
                                                            <Camera className="w-3 h-3" />
                                                            {batch.media.length}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl flex items-center justify-center border border-orange-100/50">
                                                <UtensilsCrossed className="w-10 h-10 text-orange-200" />
                                            </div>
                                        )}
                                        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center border shadow-sm z-20">
                                            <ChefHat className="w-4 h-4 text-[#E77731]" />
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                <div className="space-y-1">
                                                    <h4 className="text-xl font-black text-gray-900 group-hover:text-[#ad4e28] transition-colors leading-tight">
                                                        {batch.foodName}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-bold">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDateTime(batch.cookedDate)}
                                                    </div>
                                                </div>
                                                {getStatusBadge(batch.status)}
                                            </div>

                                            {/* Responsive Info Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-gray-50">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block flex items-center gap-1">
                                                        <Package className="w-3 h-3" /> Số lượng
                                                    </span>
                                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                                        <span className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">{batch.quantity}</span>
                                                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tighter">Suất ăn</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block flex items-center gap-1">
                                                        <User className="w-3 h-3" /> Đầu bếp
                                                    </span>
                                                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                                        <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-[9px] sm:text-[10px] shrink-0">
                                                            {batch.kitchenStaff.full_name?.charAt(0)}
                                                        </div>
                                                        <span className="text-[11px] sm:text-sm font-bold text-gray-700 truncate max-w-full sm:max-w-[120px]">
                                                            {batch.kitchenStaff.full_name}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="hidden lg:flex flex-col justify-center space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3 text-emerald-500" /> Trạng thái
                                                    </span>
                                                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        {batch.status === "DELIVERED" ? "Đã xong" : "Chờ giao"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-4 sm:mt-6 md:mt-0 flex justify-end items-end">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedMealBatchId(batch.id);
                                                    setOpenLightboxFirst(false);
                                                    setDetailDialogOpen(true);
                                                }}
                                                className="group/btn relative h-10 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-[#ad4e28] hover:text-white transition-all duration-300 font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 overflow-hidden w-full sm:w-auto"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    Xem chi tiết
                                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {selectedMealBatchId && (
                <MealBatchDetailDialog
                    mealBatchId={selectedMealBatchId}
                    open={detailDialogOpen}
                    onOpenChange={(open) => {
                        setDetailDialogOpen(open);
                        if (!open) {
                            setOpenLightboxFirst(false);
                            setInitialMediaIndex(0);
                        }
                    }}
                    initialLightboxOpen={openLightboxFirst}
                    initialMediaIndex={initialMediaIndex}
                />
            )}
        </>
    );
}
