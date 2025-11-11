"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { donationService } from "@/services/donation.service";
import { DonationDetails } from "@/types/api/donation-detail";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { getStatusColorClass, translateTransactionStatus } from "@/lib/utils/status-utils";
import {
    Receipt,
    Calendar,
    DollarSign,
    CreditCard,
    FileText,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import { Loader } from "@/components/animate-ui/icons/loader";

interface DonationDetailDialogProps {
    orderCode: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DonationDetailDialog({
    orderCode,
    open,
    onOpenChange,
}: DonationDetailDialogProps) {
    const router = useRouter();
    const [details, setDetails] = useState<DonationDetails | null>(null);
    const [loading, setLoading] = useState(false);

    // Ngăn scroll body khi dialog mở
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "0px";
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [open]);

    useEffect(() => {
        if (open && orderCode) {
            fetchDetails();
        }
    }, [open, orderCode]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const data = await donationService.getDonationDetails(orderCode);
            setDetails(data);
        } catch (error) {
            console.error("Error fetching donation details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const label = translateTransactionStatus(status);
        const colorClass = getStatusColorClass(status);

        const iconMap: Record<string, React.ReactNode> = {
            SUCCESS: <CheckCircle className="w-3 h-3" />,
            PENDING: <Clock className="w-3 h-3" />,
            PROCESSING: <Clock className="w-3 h-3" />,
            FAILED: <XCircle className="w-3 h-3" />,
            CANCELLED: <XCircle className="w-3 h-3" />,
        };

        const icon = iconMap[status.toUpperCase()] || <Clock className="w-3 h-3" />;

        return (
            <Badge className={`${colorClass} flex items-center gap-1 border`}>
                {icon}
                {label}
            </Badge>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogContent 
                className="max-w-2xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
                onWheel={(e) => e.stopPropagation()}
            >
                {/* Header cố định */}
                <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Receipt className="w-6 h-6 text-[#E77731]" />
                        Chi tiết ủng hộ
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-[#E77731]" />
                    </div>
                ) : !details ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không thể tải thông tin</p>
                    </div>
                ) : (
                    <>
                        {/* Body có scroll nội bộ */}
                        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-6 overscroll-contain">
                            {/* Header Info */}
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                                        <p className="text-lg font-bold text-gray-900 font-mono">
                                            {details.paymentTransaction.orderCode}
                                        </p>
                                    </div>
                                    {getStatusBadge(details.paymentTransaction.transactionStatus)}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Số tiền ủng hộ</p>
                                        <p className="text-2xl font-bold text-[#E77731]">
                                            {formatCurrency(details.paymentTransaction.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Số tiền đã nhận</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(details.paymentTransaction.receivedAmount)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="bg-white rounded-xl border p-6 space-y-4">
                                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#E77731]" />
                                    Thông tin giao dịch
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Ngày tạo</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDateTime(details.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Cập nhật lần cuối</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDateTime(details.paymentTransaction.updatedAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Trạng thái thanh toán</p>
                                            <div className="mt-1">
                                                {getStatusBadge(details.paymentTransaction.paymentAmountStatus)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">ID Giao dịch</p>
                                            <p className="text-sm font-medium text-gray-900 font-mono break-all">
                                                {details.paymentTransaction.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {details.paymentTransaction.description && (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-xs text-blue-600 mb-1 font-medium">Ghi chú</p>
                                        <p className="text-sm text-gray-900">
                                            {details.paymentTransaction.description}
                                        </p>
                                    </div>
                                )}

                                {details.isAnonymous && (
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <p className="text-sm text-purple-700 font-medium">
                                            🎭 Ủng hộ ẩn danh
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer cố định */}
                        <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t bg-white dark:bg-zinc-900">
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        router.push(`/campaign/${details.campaignId}`);
                                        onOpenChange(false);
                                    }}
                                    className="flex-1 bg-[#E77731] hover:bg-[#ad4e28] text-white"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem chiến dịch
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1"
                                >
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
