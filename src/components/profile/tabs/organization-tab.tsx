"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { organizationService } from "@/services/organization.service";
import { Organization } from "@/types/api/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date-utils";
import { Building2, Globe, MapPin, Phone, Eye } from "lucide-react";
import { STATUS_CONFIG } from "@/constants/status";

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="h-6 w-6 animate-spin text-[#ad4e28]" />
      </div>
    );

  if (orgs.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">
        Bạn chưa gửi yêu cầu mở tổ chức nào.
      </div>
    );

  return (
    <div className="space-y-4 p-4">
      {orgs.map((org) => (
        <Card
          key={org.id}
          className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Building2 className="w-5 h-5 text-[#ad4e28]" />
              {org.name}
            </CardTitle>

            <Badge
              className={`text-xs px-3 py-1 font-medium ${
                STATUS_CONFIG[org.status as keyof typeof STATUS_CONFIG]?.color ||
                "bg-gray-100 text-gray-600"
              }`}
            >
              {STATUS_CONFIG[org.status as keyof typeof STATUS_CONFIG]?.label ||
                org.status}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-gray-600">
            {org.description && (
              <p className="italic text-gray-500">“{org.description}”</p>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{org.address}</span>
              </div>

              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{org.phone_number}</span>
              </div>

              {org.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <a
                    href={
                      org.website.startsWith("http")
                        ? org.website
                        : `https://${org.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ad4e28] hover:underline"
                  >
                    {org.website}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Ngày tạo: {formatDate(org.created_at)}
              </p>
              {org.status === "VERIFIED" && (
                <Button
                  size="sm"
                  onClick={() => {
                    const slug = org.name
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/đ/g, "d")
                      .replace(/[^a-z0-9\s-]/g, "")
                      .trim()
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-");
                    router.push(`/organizations/${slug}`);
                  }}
                  className="bg-[#ad4e28] hover:bg-[#8d3e20] text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Xem chi tiết
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
