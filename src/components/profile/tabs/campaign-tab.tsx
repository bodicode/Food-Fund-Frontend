"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";

export function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await campaignService.getMyCampaigns({
          limit: 10,
          sortBy: "NEWEST_FIRST",
        });
        setCampaigns(data);
      } catch (err) {
        console.error("Error loading campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader className="w-5 h-5 animate-spin mr-2" />
        Đang tải chiến dịch của bạn...
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Bạn chưa tạo chiến dịch nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-[#ad4e28]">
        Chiến dịch của tôi
      </h2>

      <ul className="divide-y divide-gray-200">
        {campaigns.map((c) => (
          <li
            key={c.id}
            className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              {c.coverImage ? (
                <Image
                  src={c.coverImage}
                  alt={c.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-20 h-20"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ngày tạo:{" "}
                  {format(new Date(c.createdAt), "dd/MM/yyyy", { locale: vi })}
                </p>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${c.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : c.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {c.status === "PENDING"
                    ? "Chờ duyệt"
                    : c.status === "ACTIVE"
                      ? "Đang gây quỹ"
                      : "Khác"}
                </Badge>
              </div>
            </div>

            <button
              onClick={() => router.push(`/campaign/${c.id}`)}
              className="text-sm text-[#ad4e28] font-medium hover:underline self-start sm:self-auto"
            >
              Xem chi tiết →
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
