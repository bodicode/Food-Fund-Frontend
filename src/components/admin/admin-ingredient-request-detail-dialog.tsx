"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ingredientRequestService } from "@/services/ingredient-request.service";
import { IngredientRequest, IngredientRequestStatus } from "@/types/api/ingredient-request";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { createCampaignSlug } from "@/lib/utils/slug-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, User, Calendar, ShoppingCart, ExternalLink, Send, CreditCard, Building2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AdminIngredientRequestDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: string;
    onUpdated?: () => void;
}

const statusConfig: Record<
    IngredientRequestStatus,
    { label: string; color: string; icon: React.ElementType }
> = {
    PENDING: {
        label: "Chờ duyệt",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
    },
    APPROVED: {
        label: "Đã duyệt",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
    },
    REJECTED: {
        label: "Từ chối",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
    },
    DISBURSED: {
        label: "Đã giải ngân",
        color: "bg-blue-100 text-blue-800",
        icon: Send,
    },
};

export function AdminIngredientRequestDetailDialog({
    isOpen,
    onClose,
    requestId,
    onUpdated,
}: AdminIngredientRequestDetailDialogProps) {
    const [request, setRequest] = useState<IngredientRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [adminNote, setAdminNote] = useState("");
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchRequest = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await ingredientRequestService.getIngredientRequest(requestId);
            setRequest(data);
        } catch (error) {
            console.error("Error fetching ingredient request:", error);
        } finally {
            setLoading(false);
        }
    }, [requestId]);

    useEffect(() => {
        if (isOpen && requestId) {
            fetchRequest();
        }
    }, [isOpen, requestId, fetchRequest]);

    // ✅ Ngăn scroll body khi dialog mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleAction = (type: "APPROVED" | "REJECTED") => {
        setActionType(type);
        setShowConfirmDialog(true);
    };

    const handleConfirmAction = async () => {
        if (!actionType || !request) return;

        setIsUpdating(true);
        try {
            const result = await ingredientRequestService.updateIngredientRequestStatus(
                request.id,
                {
                    status: actionType,
                    adminNote: adminNote.trim() || undefined,
                }
            );

            if (!result) {
                throw new Error("Không nhận được phản hồi từ server");
            }

            toast.success(
                actionType === "APPROVED"
                    ? "Đã duyệt yêu cầu thành công!"
                    : "Đã từ chối yêu cầu!"
            );

            setShowConfirmDialog(false);
            onUpdated?.();
            onClose();
        } catch (error) {
            console.error("Error updating status:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
            toast.error(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent
                    className="!w-[98vw] !max-w-[98vw] sm:!max-w-[98vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
                    onWheel={(e) => e.stopPropagation()}
                >
                    <DialogHeader className="flex-shrink-0 px-8 pt-8 pb-4 border-b">
                        <DialogTitle className="text-xl font-bold">
                            Chi tiết yêu cầu nguyên liệu
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto p-8">

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
                            </div>
                        ) : request ? (
                            <div className="space-y-6">
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Trạng thái</div>
                                    <Badge
                                        className={`${statusConfig[request.status].color
                                            } flex items-center gap-1`}
                                    >
                                        {(() => {
                                            const StatusIcon = statusConfig[request.status].icon;
                                            return <StatusIcon className="w-4 h-4" />;
                                        })()}
                                        {statusConfig[request.status].label}
                                    </Badge>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {request.campaignPhase?.campaign && (
                                        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 md:col-span-2">
                                            <ShoppingCart className="w-5 h-5 text-[#ad4e28] dark:text-orange-500 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Chiến dịch</div>
                                                <Link
                                                    href={
                                                        request.campaignPhase?.campaign?.title && request.campaignPhase?.campaign?.id
                                                            ? `/admin/campaigns/${createCampaignSlug(
                                                                request.campaignPhase.campaign.title || "",
                                                                request.campaignPhase.campaign.id || ""
                                                            )}`
                                                            : "#"
                                                    }
                                                    target="_blank"
                                                    className="font-bold text-[#ad4e28] dark:text-orange-500 mt-1 text-lg hover:underline flex items-center gap-2 group"
                                                >
                                                    {request.campaignPhase?.campaign?.title}
                                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <User className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Người gửi</div>
                                            <div className="font-bold text-gray-900 dark:text-white mt-1">
                                                {request?.kitchenStaff?.full_name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Giai đoạn</div>
                                            <div className="font-bold text-gray-900 dark:text-white mt-1">
                                                {request.campaignPhase?.phaseName || "Chưa có giai đoạn"}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Ngày nấu: {request.campaignPhase?.cookingDate ? formatDateTime(new Date(request.campaignPhase.cookingDate)) : "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ngày tạo</div>
                                            <div className="font-bold text-gray-900 dark:text-white mt-1">
                                                {formatDateTime(new Date(request.created_at))}
                                            </div>
                                        </div>
                                    </div>

                                    {request.changedStatusAt && (
                                        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                    Ngày thay đổi trạng thái
                                                </div>
                                                <div className="font-bold text-gray-900 dark:text-white mt-1">
                                                    {formatDateTime(new Date(request.changedStatusAt))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Bank Info */}
                                {request.organization ? (
                                    <div className="border-4 border-green-500 rounded-lg p-6 bg-green-50/50">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-green-600" />
                                            Thông tin ngân hàng để chuyển khoản
                                        </h3>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-sm font-bold">
                                                                {request.organization.bank_short_name}
                                                            </Badge>
                                                            <p className="text-sm text-gray-700">
                                                                {request.organization.bank_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Số tài khoản</p>
                                                        <p className="text-2xl font-mono font-bold text-gray-900 bg-white px-4 py-3 rounded border-2 border-green-500">
                                                            {request.organization.bank_account_number}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Tên tài khoản</p>
                                                    <p className="font-semibold text-gray-900 text-xl bg-white px-4 py-3 rounded border">
                                                        {request.organization.bank_account_name}
                                                    </p>
                                                </div>

                                                <div className="pt-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Building2 className="h-4 w-4 text-gray-600" />
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {request.organization.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 min-w-[200px]">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mã QR Chuyển khoản</div>
                                                <div className="relative w-40 h-40">
                                                    <Image
                                                        src={`https://img.vietqr.io/image/${request.organization.bank_short_name}-${request.organization.bank_account_number}-compact2.png?amount=${request.totalCost}&addInfo=Giai ngan yeu cau ${request.id.slice(0, 8)}&accountName=${encodeURIComponent(request.organization.bank_account_name)}`}
                                                        alt="VietQR"
                                                        width={160}
                                                        height={160}
                                                        unoptimized
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-2 text-center leading-tight">
                                                    Quét mã để tự động điền<br />số tiền & nội dung
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-4 border-yellow-500 rounded-lg p-6 bg-yellow-50/50">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-yellow-600" />
                                            ⚠️ Thông tin ngân hàng
                                        </h3>
                                        <p className="text-gray-700">
                                            Yêu cầu này chưa có thông tin tổ chức/ngân hàng. Vui lòng liên hệ người yêu cầu để cập nhật thông tin trước khi giải ngân.
                                        </p>
                                    </div>
                                )}

                                {/* Total Cost */}
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng chi phí dự kiến</div>
                                    <div className="text-3xl font-bold text-[#ad4e28] dark:text-orange-500">
                                        {formatCurrency(request.totalCost)}
                                    </div>
                                </div>

                                {/* Items Table */}
                                {request.items && request.items.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-400" />
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                Danh sách nguyên liệu ({request.items.length})
                                            </h3>
                                        </div>
                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gray-100 dark:bg-gray-800">
                                                            <TableHead className="min-w-[200px] font-bold text-gray-900 dark:text-white">
                                                                Tên nguyên liệu
                                                            </TableHead>
                                                            <TableHead className="text-right min-w-[120px] font-bold text-gray-900 dark:text-white">
                                                                Số lượng
                                                            </TableHead>
                                                            <TableHead className="text-right min-w-[140px] font-bold text-gray-900 dark:text-white">
                                                                Đơn giá
                                                            </TableHead>
                                                            <TableHead className="text-right min-w-[160px] font-bold text-gray-900 dark:text-white">
                                                                Thành tiền
                                                            </TableHead>
                                                            <TableHead className="min-w-[180px] font-bold text-gray-900 dark:text-white">
                                                                Nhà cung cấp
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {request.items.map((item, index) => (
                                                            <TableRow
                                                                key={item.id}
                                                                className={
                                                                    index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-800"
                                                                }
                                                            >
                                                                <TableCell className="font-semibold text-gray-900 dark:text-white">
                                                                    {item.ingredientName}
                                                                </TableCell>
                                                                <TableCell className="text-right text-gray-900 dark:text-white">
                                                                    <span className="font-bold">
                                                                        {item.quantity} {item.unit}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-right text-gray-800 dark:text-gray-300">
                                                                    {formatCurrency(item.estimatedUnitPrice)}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <span className="font-bold text-[#ad4e28] dark:text-orange-500">
                                                                        {formatCurrency(item.estimatedTotalPrice)}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-gray-700 dark:text-gray-400">
                                                                    {item.supplier || "—"}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow className="bg-amber-100 dark:bg-amber-900/30 border-t-2 border-amber-300 dark:border-amber-700">
                                                            <TableCell
                                                                colSpan={3}
                                                                className="font-bold text-gray-900 dark:text-white text-right text-lg"
                                                            >
                                                                Tổng cộng:
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <span className="text-2xl font-bold text-[#ad4e28] dark:text-orange-500">
                                                                    {formatCurrency(request.totalCost)}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Admin Note Input */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Ghi chú của quản trị viên
                                    </label>
                                    <Textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Nhập ghi chú (tùy chọn)..."
                                        rows={4}
                                        className="w-full"
                                        disabled={request.status !== "PENDING"}
                                    />
                                </div>

                                {/* Action Buttons */}
                                {request.status === "PENDING" && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            onClick={() => handleAction("APPROVED")}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Duyệt yêu cầu
                                        </Button>
                                        <Button
                                            onClick={() => handleAction("REJECTED")}
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Từ chối
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                Không tìm thấy yêu cầu
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirm Action Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionType === "APPROVED" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div>
                                <p>
                                    Bạn có chắc chắn muốn{" "}
                                    {actionType === "APPROVED" ? "duyệt" : "từ chối"} yêu cầu này?
                                </p>
                                {adminNote && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                        <strong>Ghi chú:</strong> {adminNote}
                                    </div>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmAction}
                            disabled={isUpdating}
                            className={
                                actionType === "APPROVED"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                            }
                        >
                            {isUpdating ? "Đang xử lý..." : "Xác nhận"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
