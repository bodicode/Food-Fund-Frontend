"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categoryService } from "@/services/category.service";
import { campaignService } from "@/services/campaign.service";
import { Category } from "@/types/api/category";
import { Campaign, CampaignParams } from "@/types/api/campaign";
import { translateCampaignStatus, getStatusColorClass } from "@/lib/utils/status-utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  DollarSign,
  Users,
  MapPin,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useCampaigns } from "@/hooks/use-campaign";
import { toast } from "sonner";
import { Loader } from "@/components/animate-ui/icons/loader";
import { statusActions, statusConfig } from "@/lib/translator";

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

  const formatCurrency = (amount: string) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));

  const getStatusBadge = (status: Campaign["status"]) => {
    const cfg = statusConfig[status as keyof typeof statusConfig];
    const Icon = cfg?.icon;
    const label = translateCampaignStatus(status);
    const colorClass = getStatusColorClass(status);
    return (
      <Badge className={`${colorClass} flex items-center gap-1 border-0`}>
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
    <div className="lg:container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý Chiến dịch
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 dark:text-gray-400">
            Quản lý và theo dõi các chiến dịch gây quỹ
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="px-3 py-1">
            <Filter className="w-3 h-3 mr-1" />
            {campaigns.length} chiến dịch
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchCampaigns({}, false)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm chiến dịch..."
                value={params.search || ""}
                onChange={(e) => {
                  setParams((prev) => ({ ...prev, search: e.target.value }));
                  fetchCampaigns({ search: e.target.value });
                }}
                className="pl-10"
              />
            </div>

            <Select
              value={params.filter?.status?.[0] || "ALL"}
              onValueChange={(val) => {
                setParams((prev) => ({
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
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={params.filter?.categoryId || "ALL"}
              onValueChange={(val) => {
                setParams((prev) => ({
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
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
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
                setParams((prev) => ({
                  ...prev,
                  sortBy,
                }));
                fetchCampaigns({
                  sortBy,
                });
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEWEST_FIRST">Mới nhất</SelectItem>
                <SelectItem value="OLDEST_FIRST">Cũ nhất</SelectItem>
                <SelectItem value="ACTIVE_FIRST">Đang hoạt động trước</SelectItem>
                <SelectItem value="TARGET_AMOUNT_DESC">Mục tiêu cao nhất</SelectItem>
                <SelectItem value="TARGET_AMOUNT_ASC">Mục tiêu thấp nhất</SelectItem>
                <SelectItem value="MOST_DONATED">Nhiều đóng góp nhất</SelectItem>
                <SelectItem value="LEAST_DONATED">Ít đóng góp nhất</SelectItem>
              </SelectContent>
            </Select>
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
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={campaign.coverImage || "/placeholder.jpg"}
                  alt={campaign.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(campaign.status)}
                </div>
              </div>

              <CardHeader className="px-4 pb-2">
                <CardTitle className="text-base sm:text-lg line-clamp-2 min-h-[3.5rem]">
                  {campaign.title}
                </CardTitle>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-2">
                  <MapPin className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="line-clamp-1">
                    {campaign.phases && campaign.phases.length > 0 
                      ? `${campaign.phases.length} địa điểm` 
                      : "Chưa có địa điểm"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4 px-4 pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="font-semibold text-primary">
                      {getProgressPercentage(
                        campaign.receivedAmount,
                        campaign.targetAmount
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${getProgressPercentage(
                          campaign.receivedAmount,
                          campaign.targetAmount
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 py-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-gray-900">
                        {formatCurrency(campaign.receivedAmount)}
                      </div>
                      <div className="text-xs text-gray-500">Đã gây quỹ</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-gray-900">
                        {campaign.donationCount}
                      </div>
                      <div className="text-xs text-gray-500">Lượt đóng góp</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-gray-50"
                    onClick={() =>
                      router.push(`/admin/campaigns/${campaign.id}`)
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" /> Xem chi tiết
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-gray-50"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(
                        (statusActions[
                          campaign.status as keyof typeof statusActions
                        ] || []).length > 0
                      ) && (
                        <>
                          <DropdownMenuLabel className="text-xs text-gray-500">
                            Thay đổi trạng thái
                          </DropdownMenuLabel>
                          {(statusActions[
                            campaign.status as keyof typeof statusActions
                          ] || []).map((action) => {
                            const Icon = action.icon;
                            return (
                              <DropdownMenuItem
                                key={action.status}
                                onClick={() =>
                                  openStatusDialog(campaign, action.status)
                                }
                                className="cursor-pointer"
                              >
                                <Icon className="w-4 h-4 mr-2" />
                                {action.label}
                              </DropdownMenuItem>
                            );
                          })}
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/admin/campaigns/${campaign.id}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
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
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thay đổi trạng thái chiến dịch{" "}
              <span className="font-semibold">{selectedCampaign?.title}</span>{" "}
              thành{" "}
              <span className="font-semibold">
                {newStatus && statusConfig[newStatus].label}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isChangingStatus}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusChange}
              disabled={isChangingStatus}
              className="bg-primary hover:bg-primary/90"
            >
              {isChangingStatus ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
