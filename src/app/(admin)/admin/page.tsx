"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createCampaignSlug } from "@/lib/utils/slug-utils";
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
  PieChart as PieChartIcon,
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
import { walletService, PlatformWalletStats } from "@/services/wallet.service";
import { coverSrc } from "@/lib/utils/utils";
import type {
  CampaignStatsFilterInput,
  PlatformCampaignStats,
  Campaign,
} from "@/types/api/campaign";



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
  const [walletStats, setWalletStats] = useState<PlatformWalletStats | null>(null);
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

  const loadData = async (f: CampaignStatsFilterInput) => {
    setLoading(true);
    try {
      const [platform, campaigns, wallet] = await Promise.all([
        campaignService.getPlatformCampaignStats(f),
        campaignService.getCampaigns({
          sortBy: "NEWEST_FIRST",
          limit: 5,
          offset: 0,
        }),
        walletService.getPlatformWalletStats(),
      ]);
      setPlatformStats(platform);
      setRecentCampaigns(campaigns || []);
      setWalletStats(wallet);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filter);
  }, [filter]);

  const refreshData = async () => {
    await loadData(filter);
  };

  const getStatusBadge = (status: string) => {
    const label = translateCampaignStatus(status);
    const colorClass = getStatusColorClass(status);
    return (
      <Badge className={`${colorClass} border-0 max-w-[140px] truncate`}>
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

  const walletDistributionData = walletStats
    ? [
      { name: "Hệ thống", value: Number(walletStats.systemBalance), color: "#0ea5e9" },
      { name: "Tổ chức", value: Number(walletStats.totalFundraiserBalance), color: "#8b5cf6" },
    ].filter((item) => item.value > 0)
    : [];

  const avgFundraisingByCategoryData =
    platformStats?.byCategory
      .map((item) => ({
        name: item.categoryTitle,
        avgRaised:
          item.campaignCount > 0
            ? Math.round(Number(item.totalReceivedAmount) / item.campaignCount)
            : 0,
      }))
      .sort((a, b) => b.avgRaised - a.avgRaised) ?? [];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      {/* Header with Gradient */}
      <div className="relative mt-6 sm:mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-5 sm:p-7 lg:p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Bảng điều khiển Admin
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl">
                Tổng quan hoạt động gây quỹ trên toàn nền tảng
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="text-xs sm:text-sm">Làm mới</span>
            </Button>
          </div>

          {/* Date Range Selector */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Khoảng thời gian:</span>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={dateRange}
                onValueChange={(value) => setDateRange(value as DateRange)}
              >
                <SelectTrigger className="w-full xs:w-[180px] bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm">
                  <SelectValue placeholder="Chọn khoảng thời gian" />
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
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] sm:text-xs">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="truncate">
                    {new Date(platformStats.timeRange.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(platformStats.timeRange.endDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
              Tổng người dùng
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0 ml-1">
              <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
              {loading ? "..." : walletStats?.totalUsers.toLocaleString() ?? "--"}
            </div>
            <p className="text-[10px] xs:text-[11px] sm:text-xs text-green-600 font-medium mt-1 line-clamp-2">
              Tổng số người dùng trên hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
              Tổng chiến dịch
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0 ml-1">
              <Target className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {loading ? "..." : platformStats?.overview.totalCampaigns ?? "--"}
            </div>
            <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-600 mt-1 line-clamp-2">
              {platformStats
                ? `${platformStats.overview.activeCampaigns} hoạt động · ${platformStats.byStatus.pending} chờ duyệt`
                : "Đang tải..."}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
              Tổng quỹ gọi được
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg flex-shrink-0 ml-1">
              <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
              {loading
                ? "..."
                : platformStats
                  ? formatCurrency(Number(platformStats.financial.totalReceivedAmount))
                  : "--"}
            </div>
            <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-600 mt-1 line-clamp-2">
              Mục tiêu:{" "}
              {platformStats
                ? formatCurrency(Number(platformStats.financial.totalTargetAmount))
                : "--"}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
              Tỷ lệ thành công
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0 ml-1">
              <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {loading
                ? "..."
                : platformStats
                  ? `${Math.round(platformStats.performance.successRate * 100)}%`
                  : "--"}
            </div>
            <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-600 mt-1 line-clamp-2">
              TB:{" "}
              {platformStats
                ? `${Math.round(platformStats.performance.averageDurationDays)} ngày`
                : "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
              Số dư hệ thống
            </CardTitle>
            <div className="p-2 bg-cyan-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="lg:text-2xl sm:text-3xl font-bold text-gray-900">
              {loading
                ? "..."
                : walletStats
                  ? formatCurrency(Number(walletStats.systemBalance))
                  : "--"}
            </div>
            <p className="text-[11px] sm:text-xs text-gray-600 mt-1">
              Tổng số dư ví hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-red-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
              Giao dịch hôm nay
            </CardTitle>
            <div className="p-2 bg-rose-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {loading ? "..." : walletStats?.totalTransactionsToday ?? "--"}
            </div>
            <p className="text-[11px] sm:text-xs text-gray-600 mt-1">
              Số giao dịch trong ngày
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 opacity-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
              Giao dịch tháng này
            </CardTitle>
            <div className="p-2 bg-teal-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {loading ? "..." : walletStats?.totalTransactionsThisMonth ?? "--"}
            </div>
            <p className="text-[11px] sm:text-xs text-gray-600 mt-1ok">
              Số giao dịch trong tháng
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Wallet Stats - Row 2 (2 cards centered) */}
      <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4">
        <div className="w-full md:w-1/3">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 opacity-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                Tổ chức
              </CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {loading ? "..." : walletStats?.totalFundraisers ?? "--"}
              </div>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-1">
                Tổng số tổ chức
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                Số dư tổ chức
              </CardTitle>
              <div className="p-2 bg-violet-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {loading
                  ? "..."
                  : walletStats
                    ? formatCurrency(Number(walletStats.totalFundraiserBalance))
                    : "--"}
              </div>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-1">
                Tổng số dư của {walletStats?.totalFundraisers || 0} tổ chức
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status distribution */}
        <Card className="lg:col-span-1 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Trạng thái chiến dịch
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Phân bố theo trạng thái trên toàn nền tảng
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full overflow-x-auto">
              <div className="h-full min-w-[260px]">
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
              <CardTitle className="text-sm font-semibold">
                Hiệu suất theo danh mục
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Số chiến dịch và tổng số tiền đã gọi được theo danh mục
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full overflow-x-auto">
              <div className="h-full min-w-[420px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {categoryBarData.length > 0 ? (
                      <ReBarChart
                        data={categoryBarData}
                        margin={{ top: 20, right: 20, left: 10, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          angle={-20}
                          textAnchor="end"
                          height={45}
                        />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => {
                            const num = value as number;
                            if (num >= 1_000_000) {
                              return `${(num / 1_000_000).toFixed(0)}tr`;
                            } else if (num >= 1_000) {
                              return `${(num / 1_000).toFixed(0)}k`;
                            }
                            return `${num}`;
                          }}
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time range summary and top campaign */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Tổng quan theo khoảng thời gian
              </CardTitle>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                Số chiến dịch tạo mới, hoàn thành và tổng số tiền gọi được.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {platformStats?.timeRange ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mb-1">
                    Chiến dịch tạo mới
                  </p>
                  <p className="text-lg sm:text-xl font-semibold">
                    {platformStats.timeRange.campaignsCreated}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mb-1">
                    Chiến dịch hoàn thành
                  </p>
                  <p className="text-lg sm:text-xl font-semibold">
                    {platformStats.timeRange.campaignsCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mb-1">
                    Tổng tiền đã gọi
                  </p>
                  <p className="text-lg sm:text-xl font-semibold">
                    {totalRaisedThisRange ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mb-1">
                    Số lần ủng hộ
                  </p>
                  <p className="text-lg sm:text-xl font-semibold">
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

        <Card
          className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => {
            if (platformStats?.performance.mostFundedCampaign) {
              const slug = createCampaignSlug(
                platformStats.performance.mostFundedCampaign.title,
                platformStats.performance.mostFundedCampaign.id
              );
              router.push(`/admin/campaigns/${slug}`);
            }
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-amber-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-amber-600" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Chiến dịch nổi bật
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Chiến dịch gọi được số tiền cao nhất
            </p>
          </CardHeader>
          <CardContent>
            {platformStats?.performance.mostFundedCampaign ? (
              <div className="space-y-3">
                <p className="font-semibold text-gray-900 line-clamp-3 text-sm sm:text-base">
                  {platformStats.performance.mostFundedCampaign.title}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa có chiến dịch nổi bật</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign success rate gauge */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Tỷ lệ thành công chiến dịch
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Phần trăm chiến dịch đạt mục tiêu
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {loading ? "..." : `${Math.round((platformStats?.performance?.successRate || 0) * 100)}%`}
                </div>
                <p className="text-sm text-gray-600">
                  {platformStats?.byStatus.completed || 0} / {platformStats?.overview.totalCampaigns || 0} chiến dịch
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((platformStats?.performance?.successRate || 0) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top categories by campaign count */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Danh mục nổi bật
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Top 5 danh mục có nhiều chiến dịch nhất
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full overflow-x-auto">
              <div className="h-full min-w-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : platformStats?.byCategory && platformStats.byCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={platformStats.byCategory.slice(0, 5)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="categoryTitle"
                        type="category"
                        width={100}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === "totalReceivedAmount") return [formatCurrency(value), "Tổng tiền"];
                          return [value, "Số chiến dịch"];
                        }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="campaignCount" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} name="Số chiến dịch" />
                    </ReBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="text-sm">Chưa có dữ liệu</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Balance Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-sky-100 rounded-lg">
                <PieChartIcon className="h-4 w-4 text-sky-600" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Phân bổ tài chính
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Tỷ lệ số dư giữa hệ thống và các tổ chức
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {walletDistributionData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={walletDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        label={({ value }: any) => formatCurrency(value)}
                      >
                        {walletDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <p className="text-sm">Chưa có dữ liệu ví</p>
                    </div>
                  )}
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {walletDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average Fundraising by Category */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-violet-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-violet-600" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Hiệu quả gây quỹ trung bình
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Trung bình số tiền gọi được mỗi chiến dịch theo danh mục
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full overflow-x-auto">
              <div className="h-full min-w-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {avgFundraisingByCategoryData.length > 0 ? (
                      <ReBarChart
                        data={avgFundraisingByCategoryData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), "Trung bình"]}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="avgRaised" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                      </ReBarChart>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="text-sm">Chưa có dữ liệu danh mục</p>
                      </div>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation and Transaction Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Campaign status breakdown */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-cyan-600" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Phân bố trạng thái
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Chi tiết từng trạng thái chiến dịch
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-700">Đang hoạt động</span>
                    </div>
                    <span className="font-semibold text-gray-900">{platformStats?.byStatus.active || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm text-gray-700">Chờ duyệt</span>
                    </div>
                    <span className="font-semibold text-gray-900">{platformStats?.byStatus.pending || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm text-gray-700">Hoàn thành</span>
                    </div>
                    <span className="font-semibold text-gray-900">{platformStats?.byStatus.completed || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm text-gray-700">Từ chối</span>
                    </div>
                    <span className="font-semibold text-gray-900">{platformStats?.byStatus.rejected || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500" />
                      <span className="text-sm text-gray-700">Đã hủy</span>
                    </div>
                    <span className="font-semibold text-gray-900">{platformStats?.byStatus.cancelled || 0}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-rose-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-rose-600" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Tóm tắt giao dịch
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Thống kê giao dịch theo thời gian
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="p-3 bg-rose-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Giao dịch hôm nay</p>
                    <p className="text-2xl font-bold text-rose-600">
                      {walletStats?.totalTransactionsToday || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Giao dịch tháng này</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {walletStats?.totalTransactionsThisMonth || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Tổng số tổ chức</p>
                    <p className="text-2xl font-bold text-green-600">
                      {walletStats?.totalFundraisers || 0}
                    </p>
                  </div>
                </>
              )}
            </div>
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
              <CardTitle className="text-sm font-semibold">
                Chiến dịch gần đây
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              5 chiến dịch mới được tạo gần đây nhất
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10 sm:py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : recentCampaigns.length > 0 ? (
              <div className="space-y-3">
                {recentCampaigns.map((c) => {
                  const progress = getProgressPercentage(
                    c.receivedAmount || "0",
                    c.targetAmount || "0"
                  );
                  return (
                    <div
                      key={c.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        const slug = createCampaignSlug(c.title, c.id);
                        router.push(`/admin/campaigns/${slug}`);
                      }}
                    >
                      <div className="relative w-full sm:w-20 h-40 sm:h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={coverSrc(c.coverImage)}
                          alt={c.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-start sm:items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {c.title}
                          </p>
                          <div className="shrink-0">{getStatusBadge(c.status)}</div>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          Mục tiêu: {formatCurrency(Number(c.targetAmount || 0))} · Đã gọi:{" "}
                          {formatCurrency(Number(c.receivedAmount || 0))} ·{" "}
                          {c.donationCount || 0} lần ủng hộ
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
                        className="shrink-0 self-end sm:self-auto"
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
              <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-gray-400">
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
