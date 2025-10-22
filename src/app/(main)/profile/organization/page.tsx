"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { organizationService } from "@/services/organization.service";
import { Organization } from "@/types/api/organization";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusConfig, translateRole } from "@/lib/translator";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await organizationService.getMyOrganization();
        setOrganization(data);
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader animate loop className="h-8 w-8 text-[#ad4e28]" />
      </div>
    );

  if (!organization)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Building2 className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Chưa có tổ chức
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Bạn chưa tạo hoặc tham gia tổ chức nào.
        </p>
        <Button onClick={() => router.push("/register/organization")}>
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-b from-[#fffaf7] to-[#f8f5f3] pt-24 pb-16"
    >
      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        <Button
          variant="ghost"
          onClick={() => router.push("/profile?tab=organization")}
          className="mb-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#b6542f] to-[#e37341] text-white py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">
                    {organization.name}
                  </CardTitle>
                  <p className="text-white/90 mt-2 max-w-md leading-snug">
                    {organization.description}
                  </p>
                </div>
              </div>
              <Badge
                className={`${orgStatusConfig.color} flex items-center gap-2 px-4 py-2 text-sm font-semibold border uppercase`}
              >
                <StatusIcon className="w-4 h-4" />
                {orgStatusConfig.label}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Phone className="w-5 h-5 text-[#ad4e28]" />
                Thông tin liên hệ
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  {organization.address}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {organization.phone_number}
                </div>
                {organization.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a
                      href={
                        organization.website.startsWith("http")
                          ? organization.website
                          : `https://${organization.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ad4e28] hover:underline"
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
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span>Tổng thành viên</span>
                  <span className="font-bold text-blue-600">
                    {organization.total_members || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
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
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-gray-800">Ngày tạo: </span>
                  {formatDate(organization.created_at)}
                </div>
                {organization.updated_at && (
                  <div>
                    <span className="font-medium text-gray-800">
                      Cập nhật:{" "}
                    </span>
                    {formatDate(organization.updated_at)}
                  </div>
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
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ad4e28] to-[#d66a3a] text-white flex items-center justify-center text-xl font-bold shadow-md">
                  {organization.representative.full_name.charAt(0)}
                </div>
                <div className="flex-1">
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
                Danh sách thành viên ({organization.members?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {organization.members?.map((m) => (
                  <motion.div
                    key={m.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
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
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-purple-100 text-purple-700">
                        {translateRole(m.member_role)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Tham gia: {formatDate(m.joined_at)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
