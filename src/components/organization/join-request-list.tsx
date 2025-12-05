"use client";

import { useCallback, useEffect, useState } from "react";
import { organizationService } from "@/services/organization.service";
import { JoinRequest, JoinRequestStatus } from "@/types/api/organization";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Calendar, Phone, Mail, UserPlus } from "lucide-react";
import { formatDate } from "@/lib/utils/date-utils";
import { translateRole } from "@/lib/translator";

export function JoinRequestList() {
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<JoinRequestStatus | "ALL">("PENDING");

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const status = statusFilter === "ALL" ? undefined : (statusFilter as JoinRequestStatus);
            const { joinRequests } = await organizationService.getOrganizationJoinRequests(
                100, // Limit
                0,   // Offset
                status
            );
            setRequests(joinRequests);
        } catch (error) {
            console.error("Error fetching join requests:", error);
            toast.error("Không thể tải danh sách yêu cầu");
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleApprove = async (requestId: string) => {
        try {
            setProcessingId(requestId);
            await organizationService.approveJoinRequest(requestId);
            toast.success("Đã phê duyệt yêu cầu");
            fetchRequests(); // Refresh list to update status
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error("Có lỗi xảy ra khi phê duyệt");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            setProcessingId(requestId);
            await organizationService.rejectJoinRequest(requestId);
            toast.success("Đã từ chối yêu cầu");
            fetchRequests(); // Refresh list to update status
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error("Có lỗi xảy ra khi từ chối");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={statusFilter === "PENDING" ? "default" : "outline"}
                    className={statusFilter === "PENDING" ? "bg-[#b55631] hover:bg-[#944322]" : ""}
                    onClick={() => setStatusFilter("PENDING")}
                >
                    Chờ duyệt
                </Button>
                <Button
                    variant={statusFilter === "VERIFIED" ? "default" : "outline"}
                    className={statusFilter === "VERIFIED" ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => setStatusFilter("VERIFIED")}
                >
                    Đã duyệt
                </Button>
                <Button
                    variant={statusFilter === "REJECTED" ? "default" : "outline"}
                    className={statusFilter === "REJECTED" ? "bg-red-600 hover:bg-red-700" : ""}
                    onClick={() => setStatusFilter("REJECTED")}
                >
                    Đã từ chối
                </Button>
                <Button
                    variant={statusFilter === "ALL" ? "default" : "outline"}
                    onClick={() => setStatusFilter("ALL")}
                >
                    Tất cả
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader animate loop className="w-8 h-8 text-[#b55631]" />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {statusFilter === "PENDING"
                            ? "Hiện không có yêu cầu nào đang chờ duyệt"
                            : "Không tìm thấy yêu cầu nào"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests.map((request) => (
                        <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#b55631] font-bold">
                                            {request.member.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{request.member.full_name}</h4>
                                            <p className="text-xs text-gray-500">@{request.member.user_name}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`
                                        ${request.status === 'PENDING' ? 'bg-orange-50 text-[#b55631] border-orange-200' : ''}
                                        ${request.status === 'VERIFIED' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                                        ${request.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                                    `}>
                                        {request.status === 'PENDING' && "Chờ duyệt"}
                                        {request.status === 'VERIFIED' && "Đã duyệt"}
                                        {request.status === 'REJECTED' && "Đã từ chối"}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-5 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <UserPlus className="w-4 h-4 text-gray-400" />
                                        <span>Vai trò: {translateRole(request.member_role)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{request.member.email}</span>
                                    </div>
                                    {request.member.phone_number && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{request.member.phone_number}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>Gửi lúc: {formatDate(request.joined_at)}</span>
                                    </div>
                                </div>

                                {request.status === 'PENDING' && (
                                    <div className="flex gap-3">
                                        <Button
                                            className="flex-1 bg-[#b55631] hover:bg-[#944322] text-white"
                                            onClick={() => handleApprove(request.id)}
                                            disabled={!!processingId}
                                        >
                                            {processingId === request.id ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Duyệt
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => handleReject(request.id)}
                                            disabled={!!processingId}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Từ chối
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
