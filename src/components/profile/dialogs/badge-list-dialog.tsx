"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { badgeService } from "@/services/badge.service";
import { Badge } from "@/types/api/user";
import { Loader } from "@/components/animate-ui/icons/loader";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency-utils";

interface BadgeListDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BadgeListDialog({ open, onOpenChange }: BadgeListDialogProps) {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            const fetchBadges = async () => {
                setLoading(true);
                try {
                    const data = await badgeService.getAllBadges();
                    setBadges(data);
                } catch (error) {
                    console.error("Failed to fetch badges", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchBadges();
        }
    }, [open]);

    // Sắp xếp badges theo sort_order
    const sortedBadges = [...badges].sort((a, b) => a.sort_order - b.sort_order);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="!max-w-[1200px] w-[95vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden"
                onWheel={(e) => e.stopPropagation()}
            >
                <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Award className="w-6 h-6 text-[#ad4e28]" />
                        Danh hiệu & Huy hiệu
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-gray-50/50">
                    {loading ? (
                        <div className="flex h-60 items-center justify-center">
                            <Loader className="h-8 w-8 text-[#ad4e28] animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedBadges.map((badge) => (
                                    <Card key={badge.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-l-4 border-l-[#ad4e28]">
                                        <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-amber-50/30">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg font-bold text-[#ad4e28] flex items-center gap-2">
                                                    {badge.name}
                                                </CardTitle>
                                                <div className="bg-white p-1 rounded-full shadow-sm">
                                                    {badge.icon_url ? (
                                                        <div className="relative w-10 h-10">
                                                            <Image
                                                                src={badge.icon_url}
                                                                alt={badge.name}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Award className="w-8 h-8 text-[#ad4e28]" />
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[40px]">
                                                {badge.description}
                                            </p>

                                            {badge.milestone && (
                                                <div className="mt-auto text-xs bg-white p-2 rounded border border-dashed border-gray-200">
                                                    <div className="flex items-center gap-1 mb-1 font-semibold text-gray-700">
                                                        <ShieldCheck className="w-3 h-3 text-green-600" />
                                                        Điều kiện đạt được:
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p>{badge.milestone.description}</p>
                                                        <p className="font-medium text-[#ad4e28]">
                                                            Mức ủng hộ tối thiểu: {formatCurrency(badge.milestone.minAmount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {sortedBadges.length === 0 && (
                                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                                    Chưa có huy hiệu nào được thiết lập.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
