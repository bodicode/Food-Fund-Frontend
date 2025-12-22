"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { createCampaignSlug } from "../../../lib/utils/slug-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
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
  Clock,
  ArrowRight,
  TrendingUp,
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
  Label,
} from "recharts";
import { formatCurrency } from "../../../lib/utils/currency-utils";
import { translateCampaignStatus, getStatusColorClass } from "../../../lib/utils/status-utils";
import { campaignService } from "../../../services/campaign.service";
import { walletService, PlatformWalletStats, FundraiserWallet } from "../../../services/wallet.service";
import { expenseProofService } from "../../../services/expense-proof.service";
import { operationRequestService } from "../../../services/operation-request.service";
import { coverSrc } from "../../../lib/utils/utils";
import type {
  CampaignStatsFilterInput,
  PlatformCampaignStats,
  Campaign,
} from "../../../types/api/campaign";
import type { ExpenseProofStats } from "../../../types/api/expense-proof";
import type { OperationRequestStats } from "../../../types/api/operation-request";
import { AdminTransactionDialog } from "../../../components/admin/admin-transaction-dialog";
import { FinancialComparisonChart } from "../../../components/admin/financial-comparison-chart";

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
  const [systemWallet, setSystemWallet] = useState<FundraiserWallet | null>(null);
  const [expenseProofStats, setExpenseProofStats] = useState<ExpenseProofStats | null>(null);
  const [operationRequestStats, setOperationRequestStats] = useState<OperationRequestStats | null>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

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
      const [platform, campaigns, wallet, sysWallet, expenseProofs, operationRequests] = await Promise.all([
        campaignService.getPlatformCampaignStats(f),
        campaignService.getCampaigns({
          sortBy: "NEWEST_FIRST",
          limit: 5,
          offset: 0,
        }),
        walletService.getPlatformWalletStats(),
        walletService.getSystemWallet(),
        expenseProofService.getExpenseProofStats(),
        operationRequestService.getOperationRequestStats(),
      ]);
      setPlatformStats(platform);
      setRecentCampaigns(campaigns || []);
      setWalletStats(wallet);
      setSystemWallet(sysWallet);
      setExpenseProofStats(expenseProofs);
      setOperationRequestStats(operationRequests);
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

  // Category financial comparison for Line Chart
  const categoryFinancialData = platformStats?.byCategory
    .slice(0, 6)
    .map((item) => ({
      name: item.categoryTitle,
      amount: Number(item.totalReceivedAmount),
      avgPerCampaign: item.campaignCount > 0
        ? Math.round(Number(item.totalReceivedAmount) / item.campaignCount)
        : 0,
    }))
    .sort((a, b) => b.amount - a.amount) ?? [];

  const expenseProofChartData = expenseProofStats
    ? [
      { name: "Chờ duyệt", value: expenseProofStats.pendingCount, color: "#f59e0b" },
      { name: "Đã duyệt", value: expenseProofStats.approvedCount, color: "#10b981" },
      { name: "Từ chối", value: expenseProofStats.rejectedCount, color: "#ef4444" },
    ].filter((item) => item.value > 0)
    : [];

  const operationRequestChartData = operationRequestStats
    ? [
      { name: "Chờ duyệt", value: operationRequestStats.pendingCount, color: "#f59e0b" },
      { name: "Đã duyệt", value: operationRequestStats.approvedCount, color: "#10b981" },
      { name: "Từ chối", value: operationRequestStats.rejectedCount, color: "#ef4444" },
    ].filter((item) => item.value > 0)
    : [];

  interface ChartData {
    name: string;
    value: number;
    color: string;
  }

  const systemFinancialsData: ChartData[] = systemWallet
    ? [
      { name: "Tổng thu", value: Number(systemWallet.totalIncome), color: "#10b981" },
      { name: "Tổng chi", value: Number(systemWallet.totalExpense), color: "#ef4444" },
      { name: "Số dư", value: Number(systemWallet.balance), color: "#0ea5e9" },
    ]
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      {/* Header with Gradient */}
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0ea5e9] via-[#2563eb] to-[#4f46e5] p-6 sm:p-8 lg:p-10 text-white border border-blue-400/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
                Hệ thống Quản trị
              </h1>
              <p className="text-sky-100 text-sm sm:text-base md:text-lg font-normal opacity-90">
                Theo dõi và quản lý các hoạt động nhân đạo thời gian thực
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={refreshData}
              disabled={loading}
              className="group flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-blue-600 border-white/30 backdrop-blur-md rounded-xl transition-all duration-300"
            >
              <RefreshCw className={`w-5 h-5 transition-transform duration-700 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
              <span className="font-medium">Làm mới dữ liệu</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <Calendar className="w-5 h-5 text-sky-200" />
              <span className="text-sm font-medium">Bộ lọc:</span>
              <Select
                value={dateRange}
                onValueChange={(value) => setDateRange(value as DateRange)}
              >
                <SelectTrigger className="w-[160px] bg-transparent border-none text-white focus:ring-0 font-medium p-0 h-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                  <SelectItem value="24h">24 giờ qua</SelectItem>
                  <SelectItem value="7d">7 ngày qua</SelectItem>
                  <SelectItem value="30d">30 ngày qua</SelectItem>
                  <SelectItem value="90d">90 ngày qua</SelectItem>
                  <SelectItem value="1y">1 năm qua</SelectItem>
                  <SelectItem value="all">Toàn bộ thời gian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {platformStats?.timeRange && (
              <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border border-emerald-500/50" />
                  <span className="text-sky-50 opacity-80 uppercase tracking-wider">Chu kỳ:</span>
                </div>
                <span>
                  {new Date(platformStats.timeRange.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(platformStats.timeRange.endDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group relative overflow-hidden border border-gray-100 transition-all duration-300 bg-white dark:bg-slate-800 rounded-3xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users className="h-16 w-16 text-blue-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-gray-400">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-blue-600">
              {loading ? <div className="h-9 w-24 bg-gray-100 animate-pulse rounded" /> : (walletStats?.totalUsers || 0).toLocaleString()}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600">
                <Users className="h-3 w-3" />
              </span>
              <p className="text-xs font-normal text-gray-500">Xác thực trên hệ thống</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-100 transition-all duration-300 bg-white dark:bg-slate-800 rounded-3xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Target className="h-16 w-16 text-emerald-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-gray-400">Tổng chiến dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-emerald-600">
              {loading ? <div className="h-9 w-24 bg-gray-100 animate-pulse rounded" /> : (platformStats?.overview.totalCampaigns || 0)}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                <RefreshCw className="h-3 w-3" />
              </span>
              <p className="text-xs font-normal text-gray-500">{platformStats?.overview.activeCampaigns || 0} chiến dịch đang hoạt động</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-100 transition-all duration-300 bg-white dark:bg-slate-800 rounded-3xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <DollarSign className="h-16 w-16 text-amber-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-gray-400">Tổng quỹ nhận được</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-amber-600 truncate">
              {loading ? <div className="h-9 w-32 bg-gray-100 animate-pulse rounded" /> : formatCurrency(Number(platformStats?.financial.totalReceivedAmount || 0))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-600">
                <Target className="h-3 w-3" />
              </span>
              <p className="text-xs font-normal text-gray-500">Mục tiêu {Math.round((Number(platformStats?.financial.totalReceivedAmount || 0) / Number(platformStats?.financial.totalTargetAmount || 1)) * 100)}% kế hoạch</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-100 transition-all duration-300 bg-white dark:bg-slate-800 rounded-3xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <CheckCircle className="h-16 w-16 text-purple-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-gray-400">Tỷ lệ thành công</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-purple-600">
              {loading ? <div className="h-9 w-24 bg-gray-100 animate-pulse rounded" /> : `${Number(platformStats?.performance.successRate || 0).toFixed(1)}%`}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-50 text-purple-600">
                <Clock className="h-3 w-3" />
              </span>
              <p className="text-xs font-normal text-gray-500">TB {Math.round(platformStats?.performance.averageDurationDays || 0)} ngày/chiến dịch</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Deep Dive Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
              <span className="p-2 bg-emerald-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </span>
              Tài chính & Giao dịch
            </h2>
            <p className="text-sm text-gray-500 font-normal ml-12">Chi tiết dòng tiền và phân bổ nguồn lực hệ thống</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsTransactionDialogOpen(true)}
            className="text-blue-600 font-medium hover:bg-blue-50 rounded-xl"
          >
            Lịch sử giao dịch <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-gray-50 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 rounded-3xl">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-emerald-600 uppercase mb-1">Số dư hệ thống</p>
                <h3 className="text-3xl font-medium text-gray-900">
                  {loading ? "--" : formatCurrency(Number(walletStats?.systemBalance || 0))}
                </h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                    <span className="text-xs font-medium text-gray-500">Tổng thu</span>
                    <span className="text-sm font-medium text-emerald-600">+{formatCurrency(Number(systemWallet?.totalIncome || 0))}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                    <span className="text-xs font-medium text-gray-500">Tổng chi</span>
                    <span className="text-sm font-medium text-red-500">-{formatCurrency(Number(systemWallet?.totalExpense || 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 bg-white dark:bg-slate-800 rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium uppercase text-gray-400">Tổ chức đối tác</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-medium text-violet-600">{loading ? "--" : walletStats?.totalFundraisers}</div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">Đối tác đăng ký</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-gray-900">{loading ? "--" : formatCurrency(Number(walletStats?.totalFundraiserBalance || 0))}</div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">Tổng số dư ví</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2 border border-gray-100 bg-white dark:bg-slate-800 rounded-3xl">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Phân bổ dòng tiền Hệ thống vs Tổ chức</CardTitle>
                <div className="p-2 bg-sky-50 rounded-lg">
                  <PieChartIcon className="w-4 h-4 text-sky-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {walletDistributionData.length > 0 ? (
                    <PieChart>
                      <defs>
                        <linearGradient id="colorSystem" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.5} />
                        </linearGradient>
                        <linearGradient id="colorFundraiser" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={walletDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={4}
                        stroke="none"
                      >
                        {walletDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? "url(#colorSystem)" : "url(#colorFundraiser)"}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                        <Label
                          value={formatCurrency(walletDistributionData.reduce((acc, curr) => acc + curr.value, 0))}
                          position="center"
                          className="text-[10px] font-medium fill-gray-400"
                          dy={10}
                        />
                        <Label
                          value="Tổng số dư"
                          position="center"
                          className="text-[11px] font-medium fill-gray-500 uppercase tracking-tighter"
                          dy={-8}
                        />
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [formatCurrency(value), "Số dư"]}
                      />
                    </PieChart>
                  ) : <div className="flex items-center justify-center h-full text-gray-400">Đang tải biểu đồ...</div>}
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 pb-4">
                {walletDistributionData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
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
              <CardTitle className="text-sm font-medium">
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
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="hover:scale-105 transition-transform origin-center cursor-pointer" />
                          ))}
                          <Label
                            value={statusChartData.reduce((acc, curr) => acc + curr.value, 0)}
                            position="center"
                            className="text-2xl font-medium fill-gray-900"
                            dy={5}
                          />
                          <Label
                            value="Chiến dịch"
                            position="center"
                            className="text-[10px] font-medium fill-gray-400 uppercase tracking-widest"
                            dy={-15}
                          />
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
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
              <CardTitle className="text-sm font-medium">
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
                        barGap={8}
                      >
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.4} />
                          </linearGradient>
                          <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.4} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10, fill: '#94a3b8' }}
                          angle={-20}
                          textAnchor="end"
                          height={45}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          tick={{ fontSize: 10, fill: '#94a3b8' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 10, fill: '#94a3b8' }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => {
                            const num = value as number;
                            if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}tr`;
                            if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
                            return `${num}`;
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: '#f8fafc' }}
                          formatter={(value: number, name: string) => {
                            if (name === "Tổng số tiền") return [formatCurrency(value), name];
                            return [value, "Số chiến dịch"];
                          }}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                            border: "none",
                            borderRadius: "16px",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="campaignCount"
                          fill="url(#colorCount)"
                          name="Số chiến dịch"
                          radius={[6, 6, 0, 0]}
                          barSize={20}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="totalRaised"
                          fill="url(#colorRaised)"
                          name="Tổng số tiền"
                          radius={[6, 6, 0, 0]}
                          barSize={20}
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

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Financials */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-sm font-medium">
                Tài chính hệ thống
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Tổng thu, tổng chi và số dư hiện tại của hệ thống
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {systemFinancialsData.length > 0 ? (
                    <ReBarChart
                      data={systemFinancialsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorSystemValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => {
                          const num = value as number;
                          if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
                          if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
                          return `${num}`;
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        formatter={(value: number) => [formatCurrency(value), "Số tiền"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.98)",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Bar dataKey="value" name="Số tiền" radius={[8, 8, 0, 0]} barSize={40}>
                        {systemFinancialsData.map((entry: ChartData, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                        ))}
                      </Bar>
                    </ReBarChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm">Chưa có dữ liệu tài chính</p>
                    </div>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Wallet Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PieChartIcon className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-sm font-medium">
                Phân bổ số dư ví
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Tỷ lệ số dư giữa hệ thống và các tổ chức
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
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
                        outerRadius={100}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        label={({ name, percent }: any) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {walletDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <PieChartIcon className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm">Chưa có dữ liệu ví</p>
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
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">
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
                  <p className="text-lg sm:text-xl font-medium">
                    {platformStats.timeRange.campaignsCreated}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mb-1">
                    Chiến dịch hoàn thành
                  </p>
                  <p className="text-lg sm:text-xl font-medium">
                    {platformStats.timeRange.campaignsCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mb-1">
                    Tổng tiền đã gọi
                  </p>
                  <p className="text-lg sm:text-xl font-medium">
                    {totalRaisedThisRange ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mb-1">
                    Số lần ủng hộ
                  </p>
                  <p className="text-lg sm:text-xl font-medium">
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
              <CardTitle className="text-sm font-medium">
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
                <p className="font-medium text-gray-900 line-clamp-3 text-sm sm:text-base">
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
              <CardTitle className="text-sm font-medium">
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
                <div className="text-5xl font-medium text-purple-600 mb-2">
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
              <CardTitle className="text-sm font-medium">
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
              <CardTitle className="text-sm font-medium">
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
              <CardTitle className="text-sm font-medium">
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
      {/* Financial Line Chart - Category Comparison */}
      <FinancialComparisonChart data={categoryFinancialData} loading={loading} />

      {/* Expense Proof & Operation Request Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Proof Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-pink-100 rounded-lg">
                <PieChartIcon className="h-4 w-4 text-pink-600" />
              </div>
              <CardTitle className="text-sm font-medium">
                Yêu cầu xét duyệt hóa đơn
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Trạng thái các yêu cầu xét duyệt hóa đơn
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
                  {expenseProofChartData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={expenseProofChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={4}
                        stroke="none"
                      >
                        {expenseProofChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                        ))}
                        <Label
                          value={expenseProofChartData.reduce((acc, curr) => acc + curr.value, 0)}
                          position="center"
                          className="text-2xl font-medium fill-gray-800"
                          dy={5}
                        />
                        <Label
                          value="Hóa đơn"
                          position="center"
                          className="text-[10px] font-medium fill-gray-400 uppercase tracking-widest"
                          dy={-15}
                        />
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <p className="text-sm">Chưa có dữ liệu</p>
                    </div>
                  )}
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {expenseProofChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operation Request Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <PieChartIcon className="h-4 w-4 text-indigo-600" />
              </div>
              <CardTitle className="text-sm font-medium">
                Yêu cầu giải ngân
              </CardTitle>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Trạng thái các yêu cầu giải ngân
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
                  {operationRequestChartData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={operationRequestChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={4}
                        stroke="none"
                      >
                        {operationRequestChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                        ))}
                        <Label
                          value={operationRequestChartData.reduce((acc, curr) => acc + curr.value, 0)}
                          position="center"
                          className="text-2xl font-medium fill-gray-800"
                          dy={5}
                        />
                        <Label
                          value="Yêu cầu"
                          position="center"
                          className="text-[10px] font-medium fill-gray-400 uppercase tracking-widest"
                          dy={-15}
                        />
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <p className="text-sm">Chưa có dữ liệu</p>
                    </div>
                  )}
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {operationRequestChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
                </div>
              ))}
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
              <CardTitle className="text-sm font-medium">
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
                    <span className="font-medium text-gray-900">{platformStats?.byStatus.active || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm text-gray-700">Chờ duyệt</span>
                    </div>
                    <span className="font-medium text-gray-900">{platformStats?.byStatus.pending || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm text-gray-700">Hoàn thành</span>
                    </div>
                    <span className="font-medium text-gray-900">{platformStats?.byStatus.completed || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm text-gray-700">Từ chối</span>
                    </div>
                    <span className="font-medium text-gray-900">{platformStats?.byStatus.rejected || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500" />
                      <span className="text-sm text-gray-700">Đã hủy</span>
                    </div>
                    <span className="font-medium text-gray-900">{platformStats?.byStatus.cancelled || 0}</span>
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
              <CardTitle className="text-sm font-medium">
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
                    <p className="text-2xl font-medium text-rose-600">
                      {walletStats?.totalTransactionsToday || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Giao dịch tháng này</p>
                    <p className="text-2xl font-medium text-blue-600">
                      {walletStats?.totalTransactionsThisMonth || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Tổng số tổ chức</p>
                    <p className="text-2xl font-medium text-green-600">
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
              <CardTitle className="text-sm font-medium">
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
                      className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border-none bg-slate-50 hover:bg-white hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        const slug = createCampaignSlug(c.title, c.id);
                        router.push(`/admin/campaigns/${slug}`);
                      }}
                    >
                      <div className="relative w-full sm:w-24 h-40 sm:h-24 rounded-2xl overflow-hidden shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <Image
                          src={coverSrc(c.coverImage)}
                          alt={c.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-2 left-2 shadow-lg scale-90 origin-top-left">
                          {getStatusBadge(c.status)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 w-full space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-base sm:text-lg">
                            {c.title}
                          </h4>
                          <div className="hidden sm:flex items-center gap-1 text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                            <Clock className="w-3 h-3" />
                            {new Date(c.created_at || "").toLocaleDateString("vi-VN")}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-600">{Math.round(progress)}%</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-medium text-gray-600">{formatCurrency(Number(c.receivedAmount || 0))}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs font-medium text-gray-600">{c.donationCount || 0} lượt</span>
                          </div>
                        </div>

                        <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 flex sm:flex-col items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full bg-white shadow-sm border-gray-100 hover:bg-blue-600 hover:text-white transition-all transform hover:rotate-12"
                          onClick={(e) => {
                            e.stopPropagation();
                            const slug = createCampaignSlug(c.title, c.id);
                            router.push(`/admin/campaigns/${slug}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
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


      <AdminTransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        walletId={systemWallet?.id || null}
      />
    </div >
  );
}
