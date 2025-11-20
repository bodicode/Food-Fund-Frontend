"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoginRequiredDialog } from "@/components/shared/login-required-dialog";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { organizationService } from "@/services/organization.service";
import { Organization, OrganizationRole } from "@/types/api/organization";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date-utils";
import { translateRole } from "@/lib/translator";
import { USER_ROLES } from "@/constants";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Users,
  CheckCircle,
  ArrowLeft,
  UserPlus,
  Mail,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>(
    USER_ROLES.DELIVERY_STAFF
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoginDialogOpen, requireAuth, closeLoginDialog } = useAuthGuard();

  useEffect(() => {
    (async () => {
      try {
        const data = await organizationService.getOrganizationById(orgId);
        setOrganization(data);
      } catch (err) {
        toast.error("Không thể tải thông tin tổ chức", {
          description:
            err instanceof Error
              ? err.message
              : "Đã xảy ra lỗi không xác định.",
        });
        router.push("/organizations");
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId, router]);

  const handleJoinRequest = () => {
    requireAuth(() => {
      setSelectedRole(USER_ROLES.DELIVERY_STAFF);
      setJoinDialogOpen(true);
    });
  };

  const handleSubmitJoinRequest = async () => {
    if (!organization) return;

    try {
      setIsSubmitting(true);
      const result = await organizationService.requestJoinOrganization({
        organization_id: organization.id,
        requested_role: selectedRole,
      });

      if (result.success) {
        toast.success("Gửi yêu cầu thành công!", {
          description: result.message || "Vui lòng chờ tổ chức phê duyệt.",
        });
        setJoinDialogOpen(false);
      } else {
        toast.error("Không thể gửi yêu cầu", {
          description: result.message,
        });
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra", {
        description:
          err instanceof Error ? err.message : "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fffaf7] to-[#f9f4f1]">
        <Loader animate loop className="h-8 w-8 text-[#b55631]" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fffaf7] to-[#f9f4f1]">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy tổ chức
          </h3>
          <Button
            onClick={() => router.push("/organizations")}
            className="mt-4 bg-[#b55631] hover:bg-[#944322]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fffaf7] to-[#f8f5f3] pt-28 pb-16 overflow-hidden">
      {/* Decorative Floating Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-[#f0e6df] rounded-full blur-3xl opacity-40 top-10 left-[-60px]" />
        <div className="absolute w-80 h-80 bg-[#fbe7dd] rounded-full blur-3xl opacity-40 bottom-10 right-[-80px]" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/organizations")}
          className="flex items-center gap-2 text-[#b55631] hover:text-[#944322] font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#b6542f] to-[#e37341] text-white p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold">{organization.name}</h1>
                  </div>
                  {organization.description && (
                    <p className="text-white/90 text-lg">
                      {organization.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-8 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#b55631] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Địa chỉ</p>
                      <p className="text-gray-800">{organization.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#b55631] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Số điện thoại
                      </p>
                      <p className="text-gray-800">{organization.phone_number}</p>
                    </div>
                  </div>

                  {organization.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-[#b55631] mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Website
                        </p>
                        <a
                          href={
                            organization.website.startsWith("http")
                              ? organization.website
                              : `https://${organization.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#b55631] hover:underline break-all"
                        >
                          {organization.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">
                          Tổng thành viên
                        </p>
                        <p className="text-2xl font-bold text-blue-800">
                          {organization.total_members || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600 font-medium">
                          Thành viên hoạt động
                        </p>
                        <p className="text-2xl font-bold text-green-800">
                          {organization.active_members || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-amber-600" />
                      <div>
                        <p className="text-sm text-amber-600 font-medium">
                          Ngày thành lập
                        </p>
                        <p className="text-lg font-bold text-amber-800">
                          {formatDate(organization.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Representative */}
              {organization.representative && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Người đại diện
                  </h3>
                  <Card className="border-2 border-gray-100">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b6542f] to-[#e37341] text-white flex items-center justify-center text-2xl font-bold ring-4 ring-[#fffaf7] shadow-lg">
                          {organization.representative.full_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {organization.representative.full_name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            @{organization.representative.user_name}
                          </p>
                          {organization.representative.email && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {organization.representative.email}
                            </div>
                          )}
                          {organization.representative.phone_number && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {organization.representative.phone_number}
                            </div>
                          )}
                          <Badge
                            className={`mt-3 ${organization.representative.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {organization.representative.is_active
                              ? "Đang hoạt động"
                              : "Không hoạt động"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Members */}
              {organization.members && organization.members.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Thành viên ({organization.members.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organization.members.map((membership) => (
                      <Card key={membership.id} className="border-2 border-gray-100">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b6542f] to-[#e37341] text-white flex items-center justify-center font-bold ring-2 ring-[#fffaf7]">
                              {membership.member.full_name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">
                                {membership.member.full_name}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                @{membership.member.user_name}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {translateRole(membership.member_role)}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Tham gia: {formatDate(membership.joined_at)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4 justify-center"
        >
          <Button
            onClick={handleJoinRequest}
            className="bg-[#b55631] hover:bg-[#944322] text-white font-semibold py-3 px-8 rounded-xl transition-all"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Yêu cầu tham gia
          </Button>
        </motion.div>
      </div>

      {/* Join Request Dialog */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#b55631] flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Yêu cầu tham gia tổ chức
            </DialogTitle>
            <DialogDescription className="text-base">
              Gửi yêu cầu tham gia{" "}
              <span className="font-semibold text-gray-800">
                {organization.name}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Vai trò bạn muốn đảm nhận <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as OrganizationRole)
                }
              >
                <SelectTrigger className="w-full border-2 focus:border-[#b55631]">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={USER_ROLES.DELIVERY_STAFF}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {translateRole(USER_ROLES.DELIVERY_STAFF)}
                      </span>
                      <span className="text-xs text-gray-500">
                        - Giao hàng, vận chuyển
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value={USER_ROLES.KITCHEN_STAFF}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {translateRole(USER_ROLES.KITCHEN_STAFF)}
                      </span>
                      <span className="text-xs text-gray-500">
                        - Nhân viên bếp
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Chọn vai trò phù hợp với khả năng và thời gian của bạn
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Thông tin tổ chức:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Tên:</span> {organization.name}
                </p>
                <p>
                  <span className="font-medium">Địa chỉ:</span>{" "}
                  {organization.address}
                </p>
                <p>
                  <span className="font-medium">Số thành viên:</span>{" "}
                  {organization.total_members || 0}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setJoinDialogOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmitJoinRequest}
              disabled={isSubmitting}
              className="bg-[#b55631] hover:bg-[#944322] text-white"
            >
              {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        isOpen={isLoginDialogOpen}
        onClose={closeLoginDialog}
        title="Đăng nhập để tham gia tổ chức"
        description="Bạn cần đăng nhập để có thể gửi yêu cầu tham gia tổ chức. Vui lòng đăng nhập để tiếp tục."
        actionText="Đăng nhập ngay"
      />
    </div>
  );
}
