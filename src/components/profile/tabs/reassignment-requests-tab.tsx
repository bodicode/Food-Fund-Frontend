"use client";

import { useEffect, useState } from "react";
import { organizationService } from "@/services/organization.service";
import { ReassignmentRequest } from "@/types/api/organization";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import {
    CheckCircle,
    XCircle,
    ArrowRightLeft,
    Calendar,
    Timer,
    AlertCircle,
    Inbox,
    ArrowRight,
    ShieldAlert
} from "lucide-react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

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
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader animate loop className="w-10 h-10 text-[#ad4e28]" />
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest animate-pulse">Đang tải yêu cầu...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-50 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#ad4e28]">
                            <ArrowRightLeft className="w-4 h-4" />
                        </div>
                        <h2 className="text-xs font-bold text-[#ad4e28] uppercase tracking-[0.2em]">Hệ thống điều phối</h2>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tiếp nhận chiến dịch</h1>
                    <p className="text-sm font-medium text-gray-500 max-w-lg">
                        Xử lý các chiến dịch được hệ thống điều phối cho tổ chức của bạn để tổ chức bạn thực hiện.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                    <Inbox className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{requests.length} Yêu cầu mới</span>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {requests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-24 px-6 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Hòm thư trống</h3>
                        <p className="text-sm font-medium text-gray-400 max-w-xs">
                            Hiện không có yêu cầu điều phối nào cần xử lý. Hãy quay lại sau nhé!
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid gap-6 px-1"
                    >
                        {requests.map((request, index) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:border-[#ad4e28]/20 transition-all duration-500"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1 w-1 rounded-full bg-gray-200" />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#ad4e28] transition-colors leading-tight">
                                                {request.campaign.title}
                                            </h3>

                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                                                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Ngày điều phối</p>
                                                    <p className="text-xs font-semibold text-gray-700">{new Date(request.assignedAt).toLocaleString('vi-VN')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-red-50/50 p-3 rounded-2xl border border-red-100/50">
                                                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500">
                                                    <Timer className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-semibold text-red-400 uppercase tracking-wider">Hết hạn xử lý</p>
                                                    <p className="text-xs font-semibold text-red-700">{new Date(request.expiresAt).toLocaleString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row lg:flex-col items-center gap-3 shrink-0 lg:pl-8 lg:border-l lg:border-gray-50">
                                        <Button
                                            onClick={() => handleAction(request, "approve")}
                                            disabled={!!processingId}
                                            className="flex-1 lg:w-44 h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold shadow-lg shadow-green-100 transition-all hover:-translate-y-1 active:scale-95"
                                        >
                                            {processingId === request.id ? (
                                                <Loader animate loop className="w-5 h-5 mr-2" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                            )}
                                            Chấp nhận
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleAction(request, "reject")}
                                            disabled={!!processingId}
                                            className="flex-1 lg:w-44 h-14 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl font-semibold transition-all border border-transparent hover:border-red-100"
                                        >
                                            <XCircle className="w-5 h-5 mr-2" />
                                            Từ chối
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none bg-transparent shadow-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100"
                    >
                        <div className="p-8 sm:p-10 space-y-8">
                            <div className="space-y-4">
                                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 shadow-xl ${actionType === "approve" ? "bg-green-500 text-white shadow-green-200" : "bg-red-500 text-white shadow-red-200"
                                    }`}>
                                    {actionType === "approve" ? <ShieldAlert className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                                    {actionType === "approve" ? "Tiếp nhận chiến dịch?" : "Từ chối tiếp nhận?"}
                                </h2>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {actionType === "approve"
                                        ? "Sau khi chấp nhận, tổ chức của bạn sẽ chính thức chịu trách nhiệm quản lý và triển khai mọi hoạt động của chiến dịch này."
                                        : "Mọi thông tin về việc điều phối sẽ bị hủy bỏ. Hãy chắc chắn về quyết định của mình vì tổ chức khác sẽ được ưu tiên."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                        Ghi chú {actionType === "reject" ? "lý do" : "không bắt buộc"}
                                    </label>
                                    {actionType === "reject" && <span className="text-[10px] font-semibold text-red-500 uppercase tracking-widest">Bắt buộc *</span>}
                                </div>
                                <Textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder={
                                        actionType === "approve"
                                            ? "Thêm một lời cam kết hoặc ghi chú nội bộ..."
                                            : "Tại sao tổ chức không thể tiếp nhận lúc này?..."
                                    }
                                    className="min-h-[120px] rounded-3xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-base p-6 focus:ring-4 focus:ring-[#ad4e28]/5 border-none shadow-inner"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedRequest(null)}
                                    disabled={!!processingId}
                                    className="w-full h-14 rounded-2xl font-semibold text-gray-400 hover:text-gray-900"
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!!processingId || (actionType === "reject" && !note.trim())}
                                    className={`w-full h-14 rounded-2xl font-semibold shadow-xl transition-all active:scale-95 ${actionType === "approve"
                                        ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                                        : "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                                        }`}
                                >
                                    {processingId ? (
                                        <Loader animate loop className="w-5 h-5 mr-2" />
                                    ) : (
                                        <ArrowRight className="w-5 h-5 mr-2" />
                                    )}
                                    Xác nhận quyết định
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
