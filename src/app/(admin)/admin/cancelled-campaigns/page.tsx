"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDate } from "@/lib/utils/date-utils";
import { ArrowRight } from "lucide-react";

export default function CancelledCampaignsPage() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        try {
            const result = await campaignService.searchCampaigns({
                page,
                limit: 10,
                status: "CANCELLED",
            });

            if (result) {
                setCampaigns(result.items);
                setTotalPages(result.totalPages);
            }
        } catch (error) {
            console.error("Error fetching cancelled campaigns:", error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Chiến dịch đã hủy
                </h1>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên chiến dịch</TableHead>
                            <TableHead>Người tạo</TableHead>
                            <TableHead>Mục tiêu</TableHead>
                            <TableHead>Đã nhận</TableHead>
                            <TableHead>Ngày bắt đầu</TableHead>
                            <TableHead>Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader animate loop className="mx-auto w-6 h-6 text-gray-400" />
                                </TableCell>
                            </TableRow>
                        ) : campaigns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    Không có chiến dịch nào đã hủy.
                                </TableCell>
                            </TableRow>
                        ) : (
                            campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate">
                                        {campaign.title}
                                    </TableCell>
                                    <TableCell>{campaign.creator?.full_name}</TableCell>
                                    <TableCell>{formatCurrency(Number(campaign.targetAmount))}</TableCell>
                                    <TableCell>{formatCurrency(Number(campaign.receivedAmount))}</TableCell>
                                    <TableCell>{formatDate(campaign.fundraisingStartDate)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/admin/cancelled-campaigns/${campaign.id}/reassign`)}
                                            className="gap-2"
                                        >
                                            Điều phối
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Trước
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                        Trang {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Sau
                    </Button>
                </div>
            )}
        </div>
    );
}
