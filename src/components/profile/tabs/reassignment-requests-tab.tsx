"use client";

import { useEffect, useState } from "react";
import { organizationService } from "@/services/organization.service";
import { ReassignmentRequest } from "@/types/api/organization";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ReassignmentRequestsTab() {
    const [requests, setRequests] = useState<ReassignmentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ReassignmentRequest | null>(null);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [note, setNote] = useState("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await organizationService.getPendingReassignmentRequests();
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Không thể tải danh sách yêu cầu");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (request: ReassignmentRequest, type: "approve" | "reject") => {
        setSelectedRequest(request);
        setActionType(type);
        setNote("");
    };

    const handleSubmit = async () => {
        if (!selectedRequest || !actionType) return;

        if (actionType === "reject" && !note.trim()) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }

        setProcessingId(selectedRequest.id);
        try {
            await organizationService.respondToReassignment({
                reassignmentId: selectedRequest.id,
                accept: actionType === "approve",
                note: note.trim(),
            });

            toast.success(
                actionType === "approve"
                    ? "Đã chấp nhận yêu cầu tiếp nhận"
                    : "Đã từ chối yêu cầu tiếp nhận"
            );

            // Refresh list
            fetchRequests();
        } catch (error) {
            console.error("Error responding to request:", error);
            toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
        } finally {
            setProcessingId(null);
            setSelectedRequest(null);
            setActionType(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader animate loop className="w-8 h-8 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Yêu cầu tiếp nhận chiến dịch</h2>
                <p className="text-gray-500">
                    Danh sách các chiến dịch được điều phối cho tổ chức của bạn
                </p>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500">Hiện không có yêu cầu tiếp nhận nào.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {request.campaign.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>Được điều phối lúc: {new Date(request.assignedAt).toLocaleString('vi-VN')}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Hết hạn lúc: {new Date(request.expiresAt).toLocaleString('vi-VN')}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        onClick={() => handleAction(request, "reject")}
                                        disabled={!!processingId}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Từ chối
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleAction(request, "approve")}
                                        disabled={!!processingId}
                                    >
                                        {processingId === request.id ? (
                                            <Loader animate loop className="w-4 h-4 mr-2" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                        )}
                                        Chấp nhận
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "approve" ? "Xác nhận tiếp nhận" : "Từ chối tiếp nhận"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "approve"
                                ? "Bạn có chắc chắn muốn tiếp nhận chiến dịch này? Sau khi chấp nhận, tổ chức của bạn sẽ chịu trách nhiệm quản lý chiến dịch."
                                : "Bạn có chắc chắn muốn từ chối tiếp nhận chiến dịch này? Hành động này không thể hoàn tác."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Ghi chú {actionType === "reject" && <span className="text-red-500">*</span>}
                            </label>
                            <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder={
                                    actionType === "approve"
                                        ? "Nhập ghi chú (tùy chọn)..."
                                        : "Nhập lý do từ chối..."
                                }
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedRequest(null)}
                            disabled={!!processingId}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!!processingId || (actionType === "reject" && !note.trim())}
                            className={
                                actionType === "approve"
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                            }
                        >
                            {processingId ? (
                                <Loader animate loop className="w-4 h-4 mr-2" />
                            ) : actionType === "approve" ? (
                                <CheckCircle className="w-4 h-4 mr-2" />
                            ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                            )}
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
