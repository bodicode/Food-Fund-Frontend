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
    <div className="space-y-8 mb-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Thống kê chiến dịch
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Tổng quan hiệu quả hoạt động gây quỹ của bạn trong năm 2025
          </p>
        </div>
        <div className="bg-orange-50 text-[#ad4e28] px-4 py-1.5 rounded-full text-sm font-semibold border border-orange-100 shadow-sm">
          Năm 2025
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Campaigns */}
        <Card className="overflow-hidden border-none shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">
                Tổng quan
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-gray-900">
                {stats.overview.totalCampaigns}
              </h4>
              <p className="text-sm text-gray-500 font-medium">Chiến dịch đã tạo</p>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-gray-600"><span className="font-semibold text-gray-900">{stats.overview.activeCampaigns}</span> đang chạy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-600"><span className="font-semibold text-gray-900">{stats.overview.completedCampaigns}</span> hoàn thành</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Raised */}
        <Card className="overflow-hidden border-none shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-emerald-700">
                {Number(stats.financial.totalReceivedAmount).toLocaleString("vi-VN")}
                <span className="text-xl text-emerald-600 align-top ml-1">đ</span>
              </h4>
              <p className="text-sm text-gray-500 font-medium">Tổng quỹ nhận được</p>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-gray-100 text-xs text-gray-500">
              Mục tiêu: <span className="font-semibold text-gray-900">{Number(stats.financial.totalTargetAmount).toLocaleString("vi-VN")} đ</span>
            </div>
          </CardContent>
        </Card>

        {/* Funding Rate */}
        <Card className="overflow-hidden border-none shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-gray-900">
                {stats.financial.fundingRate.toFixed(1)}%
              </h4>
              <p className="text-sm text-gray-500 font-medium">Hiệu quả gây quỹ</p>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-gray-100 text-xs text-gray-500">
              <span className="font-semibold text-gray-900">{stats.financial.totalDonations}</span> lượt ủng hộ từ cộng đồng
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="overflow-hidden border-none shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-gray-900">
                {Math.round(stats.performance.successRate)}%
              </h4>
              <p className="text-sm text-gray-500 font-medium">Tỉ lệ thành công</p>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              TB <span className="font-semibold text-gray-900">{Math.round(stats.performance.averageDurationDays)}</span> ngày/chiến dịch
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Chart Section */}
        {statusChartData.length > 0 && (
          <Card className="md:col-span-4 border-none shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-gray-500" />
                Phân bố trạng thái
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
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
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: '#374151', fontSize: '14px', fontWeight: 500 }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span className="text-sm font-medium text-gray-600 ml-1 mr-4">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Highlight Section - Most Funded */}
        <div className={statusChartData.length > 0 ? "md:col-span-3" : "md:col-span-7"}>
          <Card className="h-full border-none shadow-[0_2px_10px_rgba(0,0,0,0.05)] relative overflow-hidden bg-gradient-to-br from-[#FFFBEB] to-white group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Award className="w-32 h-32 text-yellow-600" />
            </div>

            <CardHeader className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold w-fit mb-2">
                <Award className="w-3.5 h-3.5" />
                Nổi bật nhất
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Chiến dịch hàng đầu
              </CardTitle>
              <CardDescription>
                Chiến dịch nhận được nhiều sự ủng hộ nhất
              </CardDescription>
            </CardHeader>

            <CardContent className="relative flex-1 flex flex-col justify-center items-center text-center p-6 pt-2">
              {stats.performance.mostFundedCampaign ? (
                <div className="w-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                    <TrendingUp className="w-10 h-10 text-yellow-700" />
                  </div>

                  <Link
                    href={`/campaign/${createCampaignSlug(
                      stats.performance.mostFundedCampaign.title,
                      stats.performance.mostFundedCampaign.id
                    )}`}
                    className="block group-hover:scale-105 transition-transform duration-300"
                  >
                    <h4 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 hover:text-yellow-700 transition-colors">
                      {stats.performance.mostFundedCampaign.title}
                    </h4>
                  </Link>
                </div>
              ) : (
                <div className="text-gray-400 py-10">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Chưa có dữ liệu thống kê</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
