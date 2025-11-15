"use client";

import { useEffect, useState } from "react";
import { campaignService } from "@/services/campaign.service";
import { Loader } from "@/components/animate-ui/icons/loader";
import { translateCampaignStatus } from "@/lib/utils/status-utils";
import type { MyCampaignStats } from "@/types/api/campaign";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MyCampaignStatsSection() {
  const [stats, setStats] = useState<MyCampaignStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await campaignService.getMyCampaignStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading my campaign stats:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader className="w-4 h-4" animate loop />
        <span>Đang tải thống kê chiến dịch...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="text-sm text-gray-500">
        Không thể tải thống kê chiến dịch. Vui lòng thử lại sau.
      </p>
    );
  }

  const statusChartData = [
    { key: translateCampaignStatus("PENDING"), value: stats.byStatus.pending },
    { key: translateCampaignStatus("APPROVED"), value: stats.byStatus.approved },
    { key: translateCampaignStatus("ACTIVE"), value: stats.byStatus.active },
    { key: translateCampaignStatus("PROCESSING"), value: stats.byStatus.processing },
    { key: translateCampaignStatus("COMPLETED"), value: stats.byStatus.completed },
    { key: translateCampaignStatus("REJECTED"), value: stats.byStatus.rejected },
    { key: translateCampaignStatus("CANCELLED"), value: stats.byStatus.cancelled },
  ].filter((item) => item.value > 0);

  return (
    <div className="mb-8 border-b pb-6">
      <h3 className="text-2xl font-bold mb-6 text-[#ad4e28] hidden md:block">
        Thống kê chiến dịch của bạn
      </h3>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Tổng chiến dịch</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.overview.totalCampaigns}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Đang hoạt động:{" "}
            <span className="font-semibold text-emerald-600">
              {stats.overview.activeCampaigns}
            </span>{" "}
            chiến dịch, hoàn thành:{" "}
            <span className="font-semibold text-blue-600">
              {stats.overview.completedCampaigns}
            </span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Tổng mục tiêu</p>
          <p className="text-2xl font-bold text-gray-900">
            {Number(stats.financial.totalTargetAmount).toLocaleString("vi-VN")} đồng
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Đã gây quỹ:{" "}
            <span className="font-semibold text-emerald-600">
              {Number(stats.financial.totalReceivedAmount).toLocaleString("vi-VN")} đồng
            </span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Hiệu quả gây quỹ</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.financial.fundingRate.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Tổng lần ủng hộ:{" "}
            <span className="font-semibold">
              {stats.financial.totalDonations}
            </span>
            , trung bình:{" "}
            <span className="font-semibold">
              {Number(stats.financial.averageDonationAmount).toLocaleString("vi-VN")} đồng
            </span>
          </p>
        </div>
      </div>

      {statusChartData.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Phân bố trạng thái chiến dịch
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="key" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#ad4e28" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">
            Tỉ lệ chiến dịch hoàn thành
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {Math.round(stats.performance.successRate * 100)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Thời gian gây quỹ trung bình:{" "}
            <span className="font-semibold">
              {Math.round(stats.performance.averageDurationDays)} ngày
            </span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">
            Chiến dịch gây quỹ nhiều nhất
          </p>
          {stats.performance.mostFundedCampaign ? (
            <>
              <p className="font-semibold text-gray-900">
                {stats.performance.mostFundedCampaign.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ID: {stats.performance.mostFundedCampaign.id}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Chưa có chiến dịch nào nổi bật.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
