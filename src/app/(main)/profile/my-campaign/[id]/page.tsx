"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Loader } from "@/components/animate-ui/icons/loader";
import { statusConfig } from "@/lib/translator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  DollarSign,
  CalendarDays,
  GoalIcon,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function MyCampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await campaignService.getCampaignById(id as string);
        setCampaign(data);
      } catch (err) {
        console.error("Error fetching campaign:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader animate loop className="h-8 w-8 text-color" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Không tìm thấy chiến dịch.
      </div>
    );
  }

  const raised = Number(campaign.receivedAmount || 0);
  const goal = Number(campaign.targetAmount || 1);
  const progress = Math.min(Math.round((raised / goal) * 100), 100);
  const status = statusConfig[campaign.status];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="rounded-2xl overflow-hidden mb-8 relative">
          <Image
            src={campaign.coverImage || ""}
            alt={campaign.title}
            width={1200}
            height={500}
            className="object-cover w-[600px] h-[600px] mx-auto rounded-2xl"
          />
          <div className="absolute top-4 left-4">
            <Badge
              className={`${status.color} flex items-center gap-1 border-0`}
            >
              <status.icon className="w-4 h-4" />
              {status.label}
            </Badge>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-color mb-3">
            {campaign.title}
          </h1>
          <div
            className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: campaign.description || "" }}
          />

          {campaign.location && (
            <p className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" /> {campaign.location}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-600">Tiến độ gây quỹ</span>
            <span className="font-semibold text-[#ad4e28]">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-3 bg-[#ad4e28] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <DollarSign className="mx-auto w-5 h-5 text-green-600 mb-1" />
              <p className="text-gray-500 text-sm">Đã nhận</p>
              <p className="font-semibold">{formatCurrency(raised)}</p>
            </div>
            <div>
              <GoalIcon className="mx-auto w-5 h-5 text-yellow-600 mb-1" />
              <p className="text-gray-500 text-sm">Mục tiêu</p>
              <p className="font-semibold">{formatCurrency(goal)}</p>
            </div>
            <div>
              <Users className="mx-auto w-5 h-5 text-blue-600 mb-1" />
              <p className="text-gray-500 text-sm">Lượt đóng góp</p>
              <p className="font-semibold">{campaign.donationCount}</p>
            </div>
            <div>
              <CalendarDays className="mx-auto w-5 h-5 text-gray-600 mb-1" />
              <p className="text-gray-500 text-sm">Ngày bắt đầu</p>
              <p className="font-semibold">{formatDate(campaign.startDate)}</p>
            </div>
            <div>
              <CalendarDays className="mx-auto w-5 h-5 text-gray-600 mb-1" />
              <p className="text-gray-500 text-sm">Ngày kết thúc</p>
              <p className="font-semibold">{formatDate(campaign.endDate)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              router.push(`/profile/my-campaign/${campaign.id}/edit`)
            }
            className="btn-color"
            disabled={campaign.status !== "PENDING"}
          >
            Chỉnh sửa chiến dịch
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/campaign/${campaign.id}/donations`)}
          >
            Xem quyên góp
          </Button>
        </div>
      </div>
    </div>
  );
}
