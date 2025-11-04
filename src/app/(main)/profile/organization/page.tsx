"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { organizationService } from "@/services/organization.service";
import { Organization, JoinRequest } from "@/types/api/organization";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date-utils";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Users,
  Calendar,
  ArrowLeft,
  UserCheck,
  UserPlus,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { statusConfig, translateRole } from "@/lib/translator";
import { USER_ROLES } from "@/constants";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingAction, setProcessingAction] = useState<{
    requestId: string;
    action: "approve" | "reject";
  } | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | "remove";
    id: string;
    name?: string;
  }>({ open: false, type: "approve", id: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await organizationService.getMyOrganization();
        setOrganization(data);
        if (data) loadJoinRequests();
      } catch (err) {
        toast.error("Không thể tải thông tin tổ chức", {
          description:
            err instanceof Error
              ? err.message
              : "Đã xảy ra lỗi không xác định.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadJoinRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await organizationService.getOrganizationJoinRequests();
      const filtered = data.joinRequests.filter(
        (r) => r.member_role !== USER_ROLES.FUNDRAISER
      );
      setJoinRequests(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApproveRequest = async (id: string) => {
    setConfirmDialog({ open: false, type: "approve", id: "" });
    try {
      setProcessingAction({ requestId: id, action: "approve" });
      await organizationService.approveJoinRequest(id);
      toast.success("Đã phê duyệt yêu cầu!");
      loadJoinRequests();
    } catch (err) {
      toast.error("Không thể phê duyệt yêu cầu", {
        description: err instanceof Error ? err.message : "Vui lòng thử lại.",
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleRejectRequest = async (id: string) => {
    setConfirmDialog({ open: false, type: "reject", id: "" });
    try {
      setProcessingAction({ requestId: id, action: "reject" });
      await organizationService.rejectJoinRequest(id);
      toast.success("Đã từ chối yêu cầu");
      loadJoinRequests();
    } catch (err) {
      toast.error("Không thể từ chối yêu cầu", {
        description: err instanceof Error ? err.message : "Vui lòng thử lại.",
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleRemoveMember = async (id: string) => {
    setConfirmDialog({ open: false, type: "remove", id: "" });
    try {
      setRemovingMemberId(id);
      await organizationService.removeStaffMember(id);
      toast.success("Đã xóa thành viên khỏi tổ chức");
      const data = await organizationService.getMyOrganization();
      setOrganization(data);
    } catch (err) {
      toast.error("Không thể xóa thành viên", {
        description: err instanceof Error ? err.message : "Vui lòng thử lại.",
      });
    } finally {
      setRemovingMemberId(null);
    }
  };

  const openConfirmDialog = (
    type: "approve" | "reject" | "remove",
    id: string,
    name?: string
  ) => setConfirmDialog({ open: true, type, id, name });

  const handleConfirm = () => {
    const { type, id } = confirmDialog;
    if (type === "approve") handleApproveRequest(id);
    if (type === "reject") handleRejectRequest(id);
    if (type === "remove") handleRemoveMember(id);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fffaf7] to-[#f8f5f3]">
        <Loader animate loop className="h-8 w-8 text-[#ad4e28]" />
      </div>
    );

  if (!organization)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <Building2 className="w-14 h-14 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Chưa có tổ chức
        </h2>
        <p className="text-gray-500 mb-6">
          Bạn chưa tạo hoặc tham gia tổ chức nào.
        </p>
        <Button
          size="lg"
          onClick={() => router.push("/register/organization")}
          className="bg-[#ad4e28] hover:bg-[#8d3e20] text-white"
        >
          Tạo tổ chức mới
        </Button>
      </div>
    );

  const orgStatusConfig =
    statusConfig[organization.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;
  const StatusIcon = orgStatusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#fffaf7] to-[#f8f5f3] pt-24 pb-20"
    >
      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/profile?tab=organization")}
          className="hover:bg-gray-100 text-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>

        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#b6542f] to-[#e37341] text-white p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold leading-tight">
                    {organization.name}
                  </CardTitle>
                  {organization.description && (
                    <p className="text-white/90 mt-2 max-w-lg text-sm sm:text-base">
                      {organization.description}
                    </p>
                  )}
                </div>
              </div>

              <Badge
                className={`${orgStatusConfig.color} flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border uppercase self-start`}
              >
                <StatusIcon className="w-4 h-4" />
                {orgStatusConfig.label}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Phone className="w-5 h-5 text-[#ad4e28]" />
                Thông tin liên hệ
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  {organization.address}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {organization.phone_number}
                </div>
                {organization.website && (
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a
                      href={
                        organization.website.startsWith("http")
                          ? organization.website
                          : `https://${organization.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ad4e28] hover:underline truncate"
                    >
                      {organization.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-[#ad4e28]" />
                Thống kê
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg text-sm sm:text-base">
                  <span>Tổng thành viên</span>
                  <span className="font-bold text-blue-600">
                    {organization.total_members || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-sm sm:text-base">
                  <span>Đang hoạt động</span>
                  <span className="font-bold text-green-600">
                    {organization.active_members || 0}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-[#ad4e28]" />
                Thời gian
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Ngày tạo:</span>{" "}
                  {formatDate(organization.created_at)}
                </p>
                {organization.updated_at && (
                  <p>
                    <span className="font-medium">Cập nhật:</span>{" "}
                    {formatDate(organization.updated_at)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {organization.representative && (
          <Card className="rounded-2xl border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="w-5 h-5 text-[#ad4e28]" />
                Người đại diện
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ad4e28] to-[#d66a3a] text-white flex items-center justify-center text-xl font-bold shadow-md">
                    {organization.representative.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {organization.representative.full_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      @{organization.representative.user_name}
                    </p>
                    {organization.representative.phone_number && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {organization.representative.phone_number}
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  className={
                    organization.representative.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {organization.representative.is_active
                    ? "Đang hoạt động"
                    : "Không hoạt động"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {organization.members && organization.members?.length > 0 && (
          <Card className="rounded-2xl border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-[#ad4e28]" />
                Thành viên ({organization.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {organization.members.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ad4e28] to-[#d66a3a] text-white flex items-center justify-center font-bold">
                      {m.member.full_name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        {m.member.full_name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        @{m.member.user_name}
                      </p>
                      {m.member.phone_number && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          {m.member.phone_number}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <Badge className="bg-purple-100 text-purple-700 text-xs sm:text-sm">
                      {translateRole(m.member_role)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        openConfirmDialog(
                          "remove",
                          m.member.id,
                          m.member.full_name
                        )
                      }
                      disabled={removingMemberId === m.member.id}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      {removingMemberId === m.member.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {joinRequests.length > 0 && (
          <Card className="rounded-2xl border border-gray-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 py-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5 text-[#ad4e28]" />
                Yêu cầu tham gia ({joinRequests.length})
              </CardTitle>
              <p className="text-sm text-gray-600">
                Các yêu cầu đang chờ phê duyệt
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loadingRequests ? (
                <div className="flex justify-center py-8">
                  <Loader animate loop className="h-6 w-6 text-[#ad4e28]" />
                </div>
              ) : (
                <div className="space-y-3">
                  {joinRequests.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-2 border-gray-200 rounded-xl bg-white hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ad4e28] to-[#d66a3a] text-white flex items-center justify-center text-lg font-bold">
                          {r.member.full_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="font-semibold text-gray-800">
                              {r.member.full_name}
                            </h5>
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              {translateRole(r.member_role)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 flex flex-wrap gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {r.member.email}
                            </span>
                            {r.member.phone_number && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {r.member.phone_number}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Gửi lúc: {formatDate(r.joined_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:ml-4">
                        <Button
                          size="sm"
                          onClick={() =>
                            openConfirmDialog(
                              "approve",
                              r.id,
                              r.member.full_name
                            )
                          }
                          disabled={processingAction?.requestId === r.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processingAction?.requestId === r.id &&
                          processingAction?.action === "approve" ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Phê duyệt
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openConfirmDialog(
                              "reject",
                              r.id,
                              r.member.full_name
                            )
                          }
                          disabled={processingAction?.requestId === r.id}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          {processingAction?.requestId === r.id &&
                          processingAction?.action === "reject" ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Từ chối
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              {confirmDialog.type === "approve" && "Xác nhận phê duyệt"}
              {confirmDialog.type === "reject" && "Xác nhận từ chối"}
              {confirmDialog.type === "remove" && "Xác nhận xóa thành viên"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              {confirmDialog.type === "approve" && (
                <>
                  Phê duyệt yêu cầu tham gia của{" "}
                  <strong>{confirmDialog.name}</strong>? Họ sẽ trở thành thành
                  viên của tổ chức.
                </>
              )}
              {confirmDialog.type === "reject" && (
                <>
                  Từ chối yêu cầu tham gia của{" "}
                  <strong>{confirmDialog.name}</strong>? Hành động này không thể
                  hoàn tác.
                </>
              )}
              {confirmDialog.type === "remove" && (
                <>
                  Xóa <strong>{confirmDialog.name}</strong> khỏi tổ chức? Hành
                  động này không thể hoàn tác.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                confirmDialog.type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmDialog.type === "approve" && "Phê duyệt"}
              {confirmDialog.type === "reject" && "Từ chối"}
              {confirmDialog.type === "remove" && "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
