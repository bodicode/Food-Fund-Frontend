"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categoryService } from "../../../../services/category.service";
import { campaignService } from "../../../../services/campaign.service";
import { Category } from "../../../../types/api/category";
import { Campaign, CampaignParams } from "../../../../types/api/campaign";
import { translateCampaignStatus, getStatusColorClass } from "../../../../lib/utils/status-utils";
import { createCampaignSlug } from "../../../../lib/utils/slug-utils";
import { formatCurrency } from "../../../../lib/utils/currency-utils";

import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";

import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  MapPin,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useCampaigns } from "../../../../hooks/use-campaign";
import { toast } from "sonner";
import { Loader } from "../../../../components/animate-ui/icons/loader";
import { statusActions, statusConfig } from "../../../../lib/translator";

interface StatusActionItem {
  readonly status: Campaign["status"];
  readonly label: string;
  readonly icon: React.ElementType;
  readonly variant: string;
}

export default function AdminCampaignsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Campaign["status"] | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const { campaigns, loading, error, params, setParams, fetchCampaigns } =
    useCampaigns({ limit: 50, offset: 0 });

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);


  const getStatusBadge = (status: Campaign["status"]) => {
    const cfg = statusConfig[status as keyof typeof statusConfig];
    const Icon = cfg?.icon;
    const label = translateCampaignStatus(status);
    const colorClass = getStatusColorClass(status);
    return (
      <Badge className={`${colorClass} flex items - center gap - 1 border - 0`}>
        {Icon ? <Icon className="w-3 h-3" /> : null}
        {label}
      </Badge>
    );
  };

  const getProgressPercentage = (received: string, target: string) => {
    const receivedNum = Number(received);
    const targetNum = Number(target);
    return Math.min((receivedNum / targetNum) * 100, 100);
  };

  const handleStatusChange = async () => {
    if (!selectedCampaign || !newStatus) return;

    setIsChangingStatus(true);
    try {
      const result = await campaignService.changeStatus(
        selectedCampaign.id,
        newStatus
      );

      if (!result)
        throw new Error("Không nhận được dữ liệu phản hồi từ server");

      toast.success("Đã thay đổi trạng thái chiến dịch thành công!");
      await fetchCampaigns();
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Không thể thay đổi trạng thái. Vui lòng thử lại!");
    } finally {
      setIsChangingStatus(false);
      setSelectedCampaign(null);
      setNewStatus(null);
    }
  };

  const openStatusDialog = (campaign: Campaign, status: Campaign["status"]) => {
    setSelectedCampaign(campaign);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quản lý Chiến dịch
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl font-normal leading-relaxed">
            Giám sát và điều phối lộ trình nhân đạo trên toàn hệ thống
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{campaigns.length} chiến dịch</span>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => fetchCampaigns({}, false)}
            disabled={loading}
            className="border-slate-200 dark:border-slate-800 rounded-2xl h-12 px-6 font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <RefreshCw className={`w - 5 h - 5 mr - 2 ${loading ? 'animate-spin' : ''} `} />
            <span className="font-medium">Làm mới</span>
          </Button>
        </div>
      </div>

      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc từ khóa..."
                value={params.search || ""}
                onChange={(e) => {
                  setParams((prev: CampaignParams) => ({ ...prev, search: e.target.value }));
                  fetchCampaigns({ search: e.target.value });
                }}
                className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>

            <div className="md:col-span-7 flex flex-wrap gap-3">
              <Select
                value={params.filter?.status?.[0] || "ALL"}
                onValueChange={(val) => {
                  setParams((prev: CampaignParams) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      status:
                        val === "ALL" ? undefined : [val as Campaign["status"]],
                    },
                  }));
                  fetchCampaigns({
                    filter: {
                      ...params.filter,
                      status:
                        val === "ALL" ? undefined : [val as Campaign["status"]],
                    },
                  });
                }}
              >
                <SelectTrigger className="flex-1 min-w-[140px] h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-medium">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                  <SelectItem value="PROCESSING">Đang trong tiến trình</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={params.filter?.categoryId || "ALL"}
                onValueChange={(val) => {
                  setParams((prev: CampaignParams) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      categoryId: val === "ALL" ? undefined : val,
                    },
                  }));
                  fetchCampaigns({
                    filter: {
                      ...params.filter,
                      categoryId: val === "ALL" ? undefined : val,
                    },
                  });
                }}
              >
                <SelectTrigger className="flex-1 min-w-[140px] h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-medium">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                  <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={params.sortBy || "NEWEST_FIRST"}
                onValueChange={(val) => {
                  const sortBy = val as CampaignParams["sortBy"];
                  setParams((prev: CampaignParams) => ({
                    ...prev,
                    sortBy,
                  }));
                  fetchCampaigns({ sortBy });
                }}
              >
                <SelectTrigger className="flex-1 min-w-[140px] h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-medium">
                  <div className="flex items-center">
                    <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Sắp xếp" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                  <SelectItem value="NEWEST_FIRST">Mới nhất</SelectItem>
                  <SelectItem value="OLDEST_FIRST">Cũ nhất</SelectItem>
                  <SelectItem value="ACTIVE_FIRST">Đang hoạt động trước</SelectItem>
                  <SelectItem value="TARGET_AMOUNT_DESC">Mục tiêu cao nhất</SelectItem>
                  <SelectItem value="TARGET_AMOUNT_ASC">Mục tiêu thấp nhất</SelectItem>
                  <SelectItem value="MOST_DONATED">Đóng góp nhiều nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-12 h-12" animate animateOnView />
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            Không tìm thấy chiến dịch nào
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="group relative flex flex-col h-full border border-gray-100 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-900"
              onClick={() => {
                const slug = createCampaignSlug(campaign.title, campaign.id);
                router.push(`/admin/campaigns/${slug}`);
              }}
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={campaign.coverImage || "/placeholder.jpg"}
                  alt={campaign.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 border border-white/20 rounded-full overflow-hidden">
                  {getStatusBadge(campaign.status)}
                </div>
              </div>

              <CardHeader className="p-6 pb-2 grow">
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {campaign.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-3 text-xs font-medium text-gray-400 uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span className="truncate">
                    {campaign.phases && campaign.phases.length > 0
                      ? `${campaign.phases.length} Điểm đến`
                      : "Quốc tế"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tiến trình</span>
                    <span className="text-sm font-medium text-blue-600">
                      {(campaign.fundingProgress || getProgressPercentage(
                        campaign.receivedAmount,
                        campaign.targetAmount
                      )).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                      style={{
                        width: `${campaign.fundingProgress || getProgressPercentage(
                          campaign.receivedAmount,
                          campaign.targetAmount
                        )
                          }% `,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {formatCurrency(campaign.receivedAmount)}
                    </div>
                    <div className="text-[10px] font-medium text-gray-400 uppercase">Đã nhận</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.donationCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-medium text-gray-400 uppercase">Ủng hộ</div>
                  </div>
                </div>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="secondary"
                    className="flex-1 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-none transition-all duration-300 font-medium text-sm"
                    onClick={() => {
                      const slug = createCampaignSlug(campaign.title, campaign.id);
                      router.push(`/admin/campaigns/${slug}`);
                    }}
                  >
                    Chi tiết
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border border-gray-100 p-2">
                      {(statusActions[campaign.status as keyof typeof statusActions] || []).length > 0 && (
                        <>
                          <DropdownMenuLabel className="text-[10px] font-medium text-gray-400 uppercase px-3 py-2">
                            Cập nhật trạng thái
                          </DropdownMenuLabel>
                          {(statusActions[campaign.status as keyof typeof statusActions] as readonly StatusActionItem[] || []).map((action) => {
                            const Icon = action.icon;
                            return (
                              <DropdownMenuItem
                                key={action.status}
                                onClick={() => openStatusDialog(campaign, action.status)}
                                className="rounded-xl flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 group"
                              >
                                <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                                  <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-600" />
                                </div>
                                <span className="font-medium text-sm text-gray-700 group-hover:text-blue-600">{action.label}</span>
                              </DropdownMenuItem>
                            );
                          })}
                          <DropdownMenuSeparator className="my-2 bg-gray-50" />
                        </>
                      )}
                      <DropdownMenuItem
                        className="rounded-xl flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 group"
                        onClick={() => {
                          const slug = createCampaignSlug(campaign.title, campaign.id);
                          router.push(`/admin/campaigns/${slug}`);
                        }}
                      >
                        <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                          <Eye className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <span className="font-medium text-sm text-gray-700 group-hover:text-blue-600">Xem hồ sơ đầy đủ</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-normal">
              Bạn có chắc chắn muốn thay đổi trạng thái chiến dịch{" "}
              <span className="font-medium text-gray-900 underline decoration-blue-500/30 underline-offset-4">{selectedCampaign?.title}</span>{" "}
              thành{" "}
              <span className="font-medium text-blue-600">
                {newStatus && translateCampaignStatus(newStatus)}
              </span>
              ? Thao tác này sẽ cập nhật lộ trình của chiến dịch ngay lập tức.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isChangingStatus} className="rounded-xl border-gray-100 font-medium">
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusChange}
              disabled={isChangingStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium px-8 transition-all duration-300"
            >
              {isChangingStatus ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Duyệt
                </div>
              ) : "Xác nhận thay đổi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
