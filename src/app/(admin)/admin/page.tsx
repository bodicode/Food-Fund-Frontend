"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Target,
  DollarSign,
  CheckCircle,
  RefreshCw,
  Eye,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { translateCampaignStatus, getStatusColorClass } from "@/lib/utils/status-utils";
import { campaignService } from "@/services/campaign.service";
import { coverSrc } from "@/lib/utils/utils";
import type {
  CampaignStatsFilterInput,
  PlatformCampaignStats,
  Campaign,
} from "@/types/api/campaign";

// Mock user stats
const mockUserOverview = {
  totalUsers: 1247,
  newUsersThisMonth: 89,
};

type DateRange = "24h" | "7d" | "30d" | "90d" | "1y" | "all";

const getDateRange = (range: DateRange): { dateFrom: string; dateTo: string } => {
  const now = new Date();
  const dateTo = now.toISOString();
  let dateFrom: Date;

  switch (range) {
    case "24h":
      dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      dateFrom = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case "all":
    default:
      dateFrom = new Date("2020-01-01");
      break;
  }

  return {
    dateFrom: dateFrom.toISOString(),
    dateTo,
  };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [platformStats, setPlatformStats] = useState<PlatformCampaignStats | null>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const filter: CampaignStatsFilterInput = useMemo(() => {
    const { dateFrom, dateTo } = getDateRange(dateRange);
    return {
      dateFrom,
      dateTo,
      categoryId: null,
      creatorId: null,
      status: null,
    };
  }, [dateRange]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [platform, campaigns] = await Promise.all([
          campaignService.getPlatformCampaignStats(filter),
          campaignService.getCampaigns({
            sortBy: "NEWEST_FIRST",
            limit: 5,
            offset: 0,
          }),
        ]);
        setPlatformStats(platform);
        setRecentCampaigns(campaigns || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [platform, campaigns] = await Promise.all([
        campaignService.getPlatformCampaignStats(filter),
        campaignService.getCampaigns({
          sortBy: "NEWEST_FIRST",
          limit: 5,
          offset: 0,
        }),
      ]);
      setPlatformStats(platform);
      setRecentCampaigns(campaigns || []);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const label = translateCampaignStatus(status);
    const colorClass = getStatusColorClass(status);
    return (
      <Badge className={`${colorClass} border-0`}>
        {label}
      </Badge>
    );
  };

  const getProgressPercentage = (received: string, target: string) => {
    const receivedNum = Number(received);
    const targetNum = Number(target) || 1;
    return Math.min((receivedNum / targetNum) * 100, 100);
  };

  const statusChartData =
    platformStats &&
    [
      { name: "Đang hoạt động", value: platformStats.byStatus.active, color: "#10b981" },
      { name: "Chờ duyệt", value: platformStats.byStatus.pending, color: "#f59e0b" },
      { name: "Hoàn thành", value: platformStats.byStatus.completed, color: "#3b82f6" },
      { name: "Từ chối", value: platformStats.byStatus.rejected, color: "#ef4444" },
      { name: "Đã huỷ", value: platformStats.byStatus.cancelled, color: "#6b7280" },
    ].filter((item) => item.value > 0);

  const categoryBarData =
    platformStats?.byCategory.map((item) => ({
      name: item.categoryTitle,
      campaignCount: item.campaignCount,
      totalRaised: Number(item.totalReceivedAmount),
    })) ?? [];

  const totalRaisedThisRange =
    platformStats?.timeRange && platformStats.timeRange.totalRaised
      ? formatCurrency(Number(platformStats.timeRange.totalRaised))
      : null;

  return (
    <div className="lg:container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header with Gradient */}
      <div className="relative mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Bảng điều khiển Admin
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                Tổng quan hoạt động gây quỹ trên toàn nền tảng
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>

          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Khoảng thời gian:</span>
            </div>
            <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white hover:bg-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 giờ qua</SelectItem>
                <SelectItem value="7d">7 ngày qua</SelectItem>
                <SelectItem value="30d">30 ngày qua</SelectItem>
                <SelectItem value="90d">90 ngày qua</SelectItem>
                <SelectItem value="1y">1 năm qua</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
            {platformStats?.timeRange && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {new Date(platformStats.timeRange.startDate).toLocaleDateString("vi-VN")} - {new Date(platformStats.timeRange.endDate).toLocaleDateString("vi-VN")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview Stats with Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tổng người dùng</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : mockUserOverview.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              +{mockUserOverview.newUsersThisMonth} người mới tháng này
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tổng chiến dịch</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : (platformStats?.overview.totalCampaigns ?? "--")}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {platformStats
                ? `${platformStats.overview.activeCampaigns} hoạt động · ${platformStats.byStatus.pending} chờ duyệt`
                : "Đang tải..."}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tổng quỹ gọi được</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : (platformStats
                ? formatCurrency(Number(platformStats.financial.totalReceivedAmount))
                : "--")}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Mục tiêu: {platformStats
                ? formatCurrency(Number(platformStats.financial.totalTargetAmount))
                : "--"}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tỷ lệ thành công</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : (platformStats
                ? `${Math.round(platformStats.performance.successRate * 100)}%`
                : "--")}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              TB: {platformStats
                ? `${Math.round(platformStats.performance.averageDurationDays)} ngày`
                : "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status distribution */}
        <Card className="lg:col-span-1 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
              </div>
              <CardTitle className="text-base font-semibold">
                Trạng thái chiến dịch
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500">
              Phân bố theo trạng thái trên toàn nền tảng
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {statusChartData && statusChartData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm">Chưa có dữ liệu</p>
                    </div>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category performance */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
              </div>
              <CardTitle className="text-base font-semibold">
                Hiệu suất theo danh mục
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500">
              Số chiến dịch và tổng số tiền đã gọi được theo danh mục
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {categoryBarData.length > 0 ? (
                    <ReBarChart
                      data={categoryBarData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          `${(value as number / 1_000_000).toFixed(0)}tr`
                        }
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === "Tổng số tiền") {
                            return [formatCurrency(value), name];
                          }
                          return [value, "Số chiến dịch"];
                        }}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="campaignCount"
                        fill="#4f46e5"
                        name="Số chiến dịch"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="totalRaised"
                        fill="#f97316"
                        name="Tổng số tiền"
                        radius={[8, 8, 0, 0]}
                      />
                    </ReBarChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm">Chưa có dữ liệu theo danh mục</p>
                    </div>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time range summary and top campaign */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Tổng quan theo khoảng thời gian
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Số chiến dịch tạo mới, hoàn thành và tổng số tiền gọi được.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {platformStats?.timeRange ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Chiến dịch tạo mới</p>
                  <p className="text-xl font-semibold">
                    {platformStats.timeRange.campaignsCreated}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Chiến dịch hoàn thành</p>
                  <p className="text-xl font-semibold">
                    {platformStats.timeRange.campaignsCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tổng tiền đã gọi</p>
                  <p className="text-xl font-semibold">
                    {totalRaisedThisRange ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Số lần ủng hộ</p>
                  <p className="text-xl font-semibold">
                    {platformStats.timeRange.donationsMade}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Đang tải thống kê theo khoảng thời gian...
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={() => platformStats?.performance.mostFundedCampaign && router.push(`/admin/campaigns/${platformStats.performance.mostFundedCampaign.id}`)}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-amber-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-amber-600" />
              </div>
              <CardTitle className="text-base font-semibold">
                Chiến dịch nổi bật
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500">
              Chiến dịch gọi được số tiền cao nhất
            </p>
          </CardHeader>
          <CardContent>
            {platformStats?.performance.mostFundedCampaign ? (
              <div className="space-y-3">
                <p className="font-semibold text-gray-900 line-clamp-2">
                  {platformStats.performance.mostFundedCampaign.title}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Chưa có chiến dịch nổi bật
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-base font-semibold">
                Chiến dịch gần đây
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500">
              5 chiến dịch mới được tạo gần đây nhất
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : recentCampaigns.length > 0 ? (
              <div className="space-y-3">
                {recentCampaigns.map((c) => {
                  const progress = getProgressPercentage(c.receivedAmount || "0", c.targetAmount || "0");
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/admin/campaigns/${c.id}`)}
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={coverSrc(c.coverImage)}
                          alt={c.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {c.title}
                          </p>
                          {getStatusBadge(c.status)}
                        </div>
                        <p className="text-xs text-gray-500">
                          Mục tiêu: {formatCurrency(Number(c.targetAmount || 0))} · Đã gọi: {formatCurrency(Number(c.receivedAmount || 0))} · {c.donationCount || 0} lần ủng hộ
                        </p>
                        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/campaigns/${c.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Target className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Chưa có chiến dịch nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

