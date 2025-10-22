"use client";

import { useEffect, useState } from "react";
import { organizationService } from "@/services/organization.service";
import { Organization } from "@/types/api/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date-utils";
import { Building2, Globe, MapPin, Phone } from "lucide-react";

export function OrganizationTab() {
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
                org.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : org.status === "VERIFIED"
                  ? "bg-green-100 text-green-700"
                  : org.status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {org.status}
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

            <p className="text-xs text-gray-400 mt-2">
              Ngày tạo: {formatDate(org.created_at)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
