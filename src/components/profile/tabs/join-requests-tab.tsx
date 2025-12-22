"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Building2, Calendar, Loader2, User, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../../../store/slices/auth-slice";

import { Button } from "../../../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Badge } from "../../../components/ui/badge";
import { organizationService } from "../../../services/organization.service";
import { MyJoinRequest } from "../../../types/api/organization";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { translateRole, translateMessage } from "../../../lib/translator";

export function JoinRequestsTab() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [requests, setRequests] = useState<MyJoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await organizationService.myJoinRequest();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch join requests:", error);
            toast.error("Không thể tải danh sách yêu cầu tham gia");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleCancelRequest = async (requestId: string) => {
        try {
            setCancellingId(requestId);
            const response = await organizationService.cancelJoinRequestOrganization();
            if (response.success) {
                toast.success("Đã hủy yêu cầu tham gia thành công");
                setRequests((prev) => prev.filter((req) => req.id !== requestId));
            } else {
                toast.error(response.message || "Hủy yêu cầu thất bại");
            }
        } catch (error) {
            console.error("Failed to cancel request:", error);
            toast.error("Đã xảy ra lỗi khi hủy yêu cầu");
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Đang chờ duyệt</Badge>;
            case "VERIFIED":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã xác nhận</Badge>;
            case "REJECTED":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Đã từ chối</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="text-center py-12">
                <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Chưa có yêu cầu nào</h3>
                <p className="text-gray-500 mt-1">Bạn chưa gửi yêu cầu tham gia tổ chức nào.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Yêu cầu tham gia tổ chức</h2>
                <p className="text-muted-foreground">
                    Quản lý các yêu cầu tham gia tổ chức của bạn.
                </p>
            </div>

            <div className="grid gap-4 grid-cols-1">
                {requests.map((request) => (
                    <Card key={request.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={request.organization.representative?.avatar_url || ""} />
                                        <AvatarFallback><Building2 className="h-5 w-5 text-gray-400" /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base" title={request.organization.name}>
                                            {request.organization.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {request.organization.description || "N/A"}
                                        </CardDescription>
                                    </div>
                                </div>
                                {getStatusBadge(request.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4" />
                                <span>Vai trò: <span className="font-medium text-gray-900">{translateRole(request.requested_role)}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Ngày tạo: {request.organization.created_at ? format(new Date(request.organization.created_at), "dd/MM/yyyy", { locale: vi }) : "N/A"}</span>
                            </div>
                            {request.message && (
                                <div className="bg-gray-50 p-3 rounded-md text-gray-600 italic text-xs mt-2">
                                    &quot;{translateMessage(request.message)}&quot;
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="pt-2">
                            {request.status === "PENDING" && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="w-full gap-2"
                                            disabled={cancellingId === request.id}
                                        >
                                            {cancellingId === request.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            Hủy yêu cầu
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Xác nhận hủy yêu cầu</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Bạn có chắc chắn muốn hủy yêu cầu tham gia tổ chức <strong>{request.organization.name}</strong> không? Hành động này không thể hoàn tác.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Đóng</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleCancelRequest(request.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Xác nhận hủy
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            {request.status === "VERIFIED" && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                            disabled={cancellingId === request.id}
                                        >
                                            {cancellingId === request.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            Rời tổ chức
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Xác nhận rời tổ chức</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Bạn có chắc chắn muốn rời khỏi tổ chức <strong>{request.organization.name}</strong> không?
                                                <br />
                                                <span className="text-red-500 font-medium mt-2 block">
                                                    * Lưu ý: Bạn sẽ tự động đăng xuất để hệ thống cập nhật lại quyền hạn tài khoản.
                                                </span>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Đóng</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={async () => {
                                                    try {
                                                        setCancellingId(request.id);
                                                        const response = await organizationService.leaveOrganization();
                                                        if (response.success) {
                                                            toast.success("Đã rời tổ chức thành công");
                                                            dispatch(logout());
                                                            router.push("/login");
                                                        } else {
                                                            toast.error(response.message || "Rời tổ chức thất bại");
                                                        }
                                                    } catch (error) {
                                                        console.error("Failed to leave organization:", error);
                                                        toast.error("Đã xảy ra lỗi khi rời tổ chức");
                                                    } finally {
                                                        setCancellingId(null);
                                                    }
                                                }}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Xác nhận rời
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
