"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { campaignService } from "../../../services/campaign.service";
import { Campaign } from "../../../types/api/campaign";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Badge } from "../../ui/badge";
import { statusConfig } from "../../../lib/translator";
import {
  translateCampaignStatus,
  getStatusColorClass,
} from "../../../lib/utils/status-utils";
import Link from "next/link";
import { MyCampaignStatsSection } from "../my-campaign-stats";
import { createCampaignSlug } from "../../../lib/utils/slug-utils";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
        <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16 bg-gray-50 rounded-xl">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      Chưa có chiến dịch
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Bắt đầu tạo chiến dịch đầu tiên của bạn.
    </p>
    <div className="mt-6">
      <Link
        href="/create-campaign"
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ad4e28] hover:bg-[#9c4624]"
      >
        + Tạo chiến dịch mới
      </Link>
    </div>
  </div>
);

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const router = useRouter();
  const config = statusConfig[campaign.status];
  const Icon = config?.icon;
  const statusLabel = translateCampaignStatus(campaign.status);
  const statusColor = getStatusColorClass(campaign.status);

  return (
    <div
      onClick={() => {
        const slug = createCampaignSlug(campaign.title, campaign.id);
        router.push(`/profile/my-campaign/${slug}`);
      }}
      className="bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
    >
      <div className="relative w-full h-40">
        {campaign.coverImage ? (
          <Image
            src={campaign.coverImage}
            alt={campaign.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {config && Icon && (
          <Badge
            className={`${statusColor} absolute top-3 right-3 flex items-center gap-1 border-0`}
          >
            <Icon className="w-3 h-3" />
            {statusLabel}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-[#ad4e28]">
          {campaign.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Ngày tạo:{" "}
          {format(new Date(campaign.created_at), "dd/MM/yyyy", { locale: vi })}
        </p>
      </div>
    </div>
  );
};

export function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }
    if (campaigns.length === 0) {
      return <EmptyState />;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6">
      <MyCampaignStatsSection />

      <h2 className="text-2xl font-bold mb-6 text-[#ad4e28] hidden md:block">
        Chiến dịch của tôi
      </h2>

      {renderContent()}
    </div>
  );
}
