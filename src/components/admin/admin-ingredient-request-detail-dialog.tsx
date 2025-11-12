"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ingredientRequestService } from "@/services/ingredient-request.service";
import { IngredientRequest, IngredientRequestStatus } from "@/types/api/ingredient-request";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
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
import { CheckCircle, XCircle, Clock, User, Calendar, ShoppingCart, ExternalLink } from "lucide-react";
import { toast } from "sonner";

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
};

export function AdminIngredientRequestDetailDialog({
    isOpen,
    onClose,
    requestId,
    onUpdated,
}: AdminIngredientRequestDetailDialogProps) {
    const router = useRouter();
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
                <DialogContent className="!w-[98vw] !max-w-[98vw] sm:!max-w-[98vw] h-[98vh] overflow-y-auto p-8">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            Chi tiết yêu cầu nguyên liệu
                        </DialogTitle>
                    </DialogHeader>

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
                                {request.campaignPhase.campaign && (
                                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 md:col-span-2">
                                        <ShoppingCart className="w-5 h-5 text-[#ad4e28] dark:text-orange-500 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Chiến dịch</div>
                                            <button
                                                onClick={() => {
                                                    router.push(`/admin/campaigns/${request.campaignPhase.campaign?.id}`);
                                                    onClose();
                                                }}
                                                className="font-bold text-[#ad4e28] dark:text-orange-500 mt-1 text-lg hover:underline flex items-center gap-2 group"
                                            >
                                                {request.campaignPhase.campaign.title}
                                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <User className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Người bếp</div>
                                        <div className="font-bold text-gray-900 dark:text-white mt-1">
                                            {request.kitchenStaff.full_name}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Giai đoạn</div>
                                        <div className="font-bold text-gray-900 dark:text-white mt-1">
                                            {request.campaignPhase.phaseName}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            Ngày nấu: {formatDateTime(request.campaignPhase.cookingDate)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ngày tạo</div>
                                        <div className="font-bold text-gray-900 dark:text-white mt-1">
                                            {formatDateTime(request.created_at)}
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
                                                {formatDateTime(request.changedStatusAt)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                                                    {item.quantity}
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
