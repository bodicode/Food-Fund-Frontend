"use client";

import { useEffect, useState } from "react";
import { campaignService } from "../../services/campaign.service";
import { Loader } from "../animate-ui/icons/loader";
import { translateCampaignStatus } from "../../lib/utils/status-utils";
import type { PlatformCampaignStats } from "../../types/api/campaign";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Link from "next/link";
import { createCampaignSlug } from "../../lib/utils/slug-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Wallet,
  Target,
  TrendingUp,
  Award,
  Clock,
  PieChart as PieChartIcon,
  Activity,
  Layers,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

export function MyCampaignStatsSection() {
  const [stats, setStats] = useState<PlatformCampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        const data = await campaignService.getPlatformCampaignStats({
          dateFrom: "2025-01-01T00:00:00.000Z",
          dateTo: "2025-12-31T23:59:59.999Z",
          categoryId: null,
          creatorId: user.id,
          status: null,
        });
        setStats(data);
      } catch (error) {
        console.error("Error loading my campaign stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
        <Loader className="w-6 h-6 text-[#ad4e28]" animate loop />
        <span>Đang tải thống kê chiến dịch...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
          <Activity className="w-10 h-10 mb-2 opacity-20" />
          <p>Không thể tải thống kê chiến dịch.</p>
          <p className="text-xs mt-1">Vui lòng thử lại sau.</p>
        </CardContent>
      </Card>
    );
  }

  const statusChartData = [
    { name: translateCampaignStatus("PENDING"), value: stats.byStatus.pending },
    { name: translateCampaignStatus("APPROVED"), value: stats.byStatus.approved },
    { name: translateCampaignStatus("ACTIVE"), value: stats.byStatus.active },
    { name: translateCampaignStatus("PROCESSING"), value: stats.byStatus.processing },
    { name: translateCampaignStatus("COMPLETED"), value: stats.byStatus.completed },
    { name: translateCampaignStatus("REJECTED"), value: stats.byStatus.rejected },
    { name: translateCampaignStatus("CANCELLED"), value: stats.byStatus.cancelled },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6 mb-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#ad4e28] hidden md:block">
          Thống kê chiến dịch
        </h3>
        <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Năm 2025
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-blue-50 to-transparent">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng quan
            </CardTitle>
            <Layers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">
              {stats.overview.totalCampaigns}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-medium bg-emerald-50 px-1.5 rounded">
                {stats.overview.activeCampaigns} đang chạy
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-blue-600 font-medium bg-blue-50 px-1.5 rounded">
                {stats.overview.completedCampaigns} xong
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-emerald-50 to-transparent">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng quỹ nhận được
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-700">
              {Number(stats.financial.totalReceivedAmount).toLocaleString("vi-VN")}{" "}
              <span className="text-sm font-normal text-emerald-600">đ</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mục tiêu: {Number(stats.financial.totalTargetAmount).toLocaleString("vi-VN")} đ
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-orange-50 to-transparent">
            <CardTitle className="text-sm font-medium text-gray-600">
              Hiệu quả gây quỹ
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">
              {stats.financial.fundingRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.financial.totalDonations} lượt ủng hộ
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-purple-50 to-transparent">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tỉ lệ thành công
            </CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(stats.performance.successRate * 100)}%
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              TB {Math.round(stats.performance.averageDurationDays)} ngày/chiến dịch
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Chart Section */}
        {statusChartData.length > 0 && (
          <Card className="md:col-span-4 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-gray-500" />
                Phân bố trạng thái
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={(_props) => {
                        const props = _props as unknown as { percent: number };
                        return `${(props.percent * 100).toFixed(0)}%`;
                      }}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#374151', fontSize: '14px' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => <span className="text-sm text-gray-600 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Highlight Section - Most Funded */}
        <div className={statusChartData.length > 0 ? "md:col-span-3" : "md:col-span-7"}>
          <Card className="h-full shadow-sm flex flex-col bg-gradient-to-br from-yellow-50 via-white to-white border-yellow-200">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2 text-yellow-700">
                <Award className="w-5 h-5" />
                Chiến dịch nổi bật nhất
              </CardTitle>
              <CardDescription>
                Chiến dịch gây quỹ được nhiều nhất
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              {stats.performance.mostFundedCampaign ? (
                <div className="text-center p-6 bg-white rounded-xl border border-yellow-100 shadow-sm mx-auto w-full">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                    <Link
                      href={`/profile/my-campaign/${createCampaignSlug(
                        stats.performance.mostFundedCampaign.title,
                        stats.performance.mostFundedCampaign.id
                      )}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {stats.performance.mostFundedCampaign.title}
                    </Link>
                  </h4>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Chưa có dữ liệu chiến dịch nổi bật</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
