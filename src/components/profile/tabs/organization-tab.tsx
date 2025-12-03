"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { organizationService } from "@/services/organization.service";
import { Organization } from "@/types/api/organization";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date-utils";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Eye,
  Mail,
  User,
  Calendar,
} from "lucide-react";
import { STATUS_CONFIG } from "@/constants/status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function OrganizationTab() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await organizationService.getMyOrganizationRequests();
        setOrgs(res);
      } catch (err: unknown) {
        toast.error("Không thể tải danh sách tổ chức", {
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

  const getSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-[#ad4e28]" />
      </div>
    );

  if (orgs.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-orange-50 p-6 rounded-full mb-4">
          <Building2 className="w-12 h-12 text-[#ad4e28]" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Chưa có tổ chức
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
          Bạn chưa gửi yêu cầu thành lập tổ chức nào. Hãy bắt đầu hành trình thiện nguyện của bạn ngay hôm nay.
        </p>
        <Button
          onClick={() => router.push("/register/organization")}
          className="bg-[#ad4e28] hover:bg-[#8d3e20] text-white"
        >
          Đăng ký tổ chức
        </Button>
      </div>
    );

  return (
    <div className="space-y-8 p-2 md:p-6">
      {orgs.map((org) => (
        <Card
          key={org.id}
          className="border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
        >
          {/* Header Banner */}
          <div className="h-10 bg-white relative border-b border-gray-200">
            <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end translate-y-1/2">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-orange-50 flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-[#ad4e28]" />
                </div>
                <div className="mb-3 hidden md:block">
                  <h2 className="text-2xl font-bold text-gray-900 leading-none">
                    Tổ chức {org.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1 font-medium">
                    <User className="w-3 h-3" />
                    Đại diện: {org.representative?.full_name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mb-14 md:mb-3 flex items-center gap-3">
                {org.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={async () => {
                      try {
                        await organizationService.cancelMyCreateOrganizationRequest();
                        toast.success("Đã hủy yêu cầu tạo tổ chức thành công");
                        // Refresh list
                        const res = await organizationService.getMyOrganizationRequests();
                        setOrgs(res);
                      } catch (_error) {
                        toast.error("Không thể hủy yêu cầu");
                      }
                    }}
                  >
                    Hủy yêu cầu
                  </Button>
                )}
                <Badge
                  className={`px-3 py-1 text-sm font-medium border-0 ${STATUS_CONFIG[org.status as keyof typeof STATUS_CONFIG]?.color ||
                    "bg-gray-100 text-gray-600"
                    }`}
                >
                  {STATUS_CONFIG[org.status as keyof typeof STATUS_CONFIG]?.label ||
                    org.status}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="pt-16 pb-6 px-4 md:px-6">
            {/* Mobile Title (visible only on small screens) */}
            <div className="md:hidden mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-900">{org.name}</h2>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Đại diện: {org.representative?.full_name || "N/A"}
              </p>
            </div>

            <div className="space-y-6">
              {/* Description Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Giới thiệu
                </h3>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                  {org.activity_field && (
                    <div className="flex items-center gap-2 text-sm text-[#ad4e28] font-bold bg-orange-100 w-fit px-3 py-1 rounded-full">
                      <Building2 className="w-4 h-4" />
                      {org.activity_field}
                    </div>
                  )}
                  <p className="text-gray-800 leading-relaxed italic font-medium">
                    {org.description ? `"${org.description}"` : "Chưa có mô tả"}
                  </p>
                </div>
              </div>

              {org.status === "REJECTED" && org.reason && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-2">
                    Lý do từ chối
                  </h3>
                  <p className="text-red-700 text-sm font-medium">{org.reason}</p>
                </div>
              )}

              {/* Contact Info Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Thông tin liên hệ
                </h3>
                <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Địa chỉ</p>
                      <p className="text-sm text-gray-900 font-medium">{org.address}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Điện thoại</p>
                      <p className="text-sm text-gray-900 font-medium">{org.phone_number}</p>
                    </div>
                  </div>

                  <Separator />

                  {org.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Email</p>
                        <p className="text-sm text-gray-900 font-medium">{org.email}</p>
                      </div>
                    </div>
                  )}

                  {org.website && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">Website</p>
                          <a
                            href={
                              org.website.startsWith("http")
                                ? org.website
                                : `https://${org.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#ad4e28] font-bold hover:underline break-all"
                          >
                            {org.website}
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bank Information */}
              {(org.bank_name || org.bank_account_number) && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Thông tin ngân hàng
                  </h3>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Ngân hàng</p>
                      <p className="text-sm font-bold text-gray-900">
                        {org.bank_name} {org.bank_short_name ? `(${org.bank_short_name})` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Số tài khoản</p>
                      <p className="text-sm font-bold text-gray-900 font-mono tracking-wide">
                        {org.bank_account_number}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Chủ tài khoản</p>
                      <p className="text-sm font-bold text-gray-900 uppercase">
                        {org.bank_account_name}
                      </p>
                    </div>
                  </div>
                </div>
              )}



              {/* Representative Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Người đại diện
                </h3>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-gray-200">
                      <AvatarImage src={org.representative?.avatar_url || ""} />
                      <AvatarFallback className="bg-orange-50 text-[#ad4e28] font-bold">
                        {org.representative_name?.charAt(0) || org.representative?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {org.representative_name || org.representative?.full_name}
                      </p>
                      {org.representative_identity_number && (
                        <p className="text-xs text-gray-500 font-medium">CCCD/CMND: {org.representative_identity_number}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium justify-center md:justify-start">
                  <Calendar className="w-4 h-4" />
                  <span>Ngày tạo: {formatDate(org.created_at)}</span>
                </div>

                {org.status === "VERIFIED" && (
                  <Button
                    onClick={() => router.push(`/organizations/${getSlug(org.name)}`)}
                    className="w-full bg-[#ad4e28] hover:bg-[#8d3e20] text-white shadow-md transition-all hover:translate-y-[-2px] font-bold py-6"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Xem trang tổ chức
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))
      }
    </div >
  );
}
