"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import {
  CalendarDays,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  ArrowLeft,
  TrendingUp,
  Clock,
} from "lucide-react";
import { statusConfig } from "@/lib/translator";
import { formatDate } from "@/lib/utils/date-utils";

export default function AdminCampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await campaignService.getCampaignById(id as string);
        if (!data) throw new Error("Không tìm thấy chiến dịch.");
        setCampaign(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin chiến dịch.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatCurrency = (amount?: string | number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const handleStatusChange = async (status: Campaign["status"]) => {
    if (!campaign) return;
    setIsUpdating(true);
    try {
      await campaignService.changeStatus(campaign.id, status);
      toast.success(
        `Đã cập nhật trạng thái thành ${statusConfig[status].label}`
      );
      const updated = await campaignService.getCampaignById(campaign.id);
      setCampaign(updated);
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật trạng thái.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#1e293b]">
        <div className="text-center space-y-4">
          <Loader animate loop className="w-8 h-8 mx-auto text-[#38bdf8]" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Đang tải...
          </p>
        </div>
      </div>
    );

  if (!campaign)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#1e293b]">
        <Card className="max-w-md mx-4 border-gray-200 dark:border-gray-700 dark:bg-[#1e293b]">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Không tìm thấy chiến dịch
            </h3>
            <Button
              onClick={() => router.push("/admin/campaigns")}
              className="bg-[#38bdf8] hover:bg-[#0ea5e9] dark:bg-[#38bdf8] dark:hover:bg-[#0ea5e9]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  const progress =
    (Number(campaign.receivedAmount) / Number(campaign.targetAmount)) * 100 ||
    0;

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#1e293b] transition-colors">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/campaigns")}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>

            <div className="flex flex-wrap gap-2">
              {campaign.status === "PENDING" && (
                <>
                  <Button
                    onClick={() => handleStatusChange("APPROVED")}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Duyệt chiến dịch
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("REJECTED")}
                    disabled={isUpdating}
                    variant="destructive"
                    className="shadow-md hover:shadow-lg transition-all"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </Button>
                </>
              )}

              {campaign.status === "ACTIVE" && (
                <Button
                  onClick={() => handleStatusChange("CANCELLED")}
                  disabled={isUpdating}
                  variant="destructive"
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Hủy chiến dịch
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              className={`${
                statusConfig[campaign.status].color
              } border-0 px-4 py-1.5 text-sm font-semibold shadow-sm`}
            >
              {statusConfig[campaign.status].label}
            </Badge>
            <Badge
              variant="outline"
              className="border-2 border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10 dark:border-[#38bdf8] dark:text-[#38bdf8] dark:bg-[#38bdf8]/10 px-4 py-1.5 text-sm font-semibold"
            >
              {campaign.category?.title}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              ID: {campaign.id}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {campaign.title}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 overflow-hidden group dark:bg-[#1e293b]">
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                <Image
                  src={campaign.coverImage || ""}
                  alt={campaign.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:bg-[#1e293b]">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Tiến độ quyên góp
                  </h3>
                  <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {progress.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-white/60 dark:bg-gray-800/60 rounded-full h-4 shadow-inner">
                    <div
                      className="h-4 rounded-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 dark:from-green-400 dark:via-green-500 dark:to-emerald-500 shadow-md transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Đã nhận: {formatCurrency(campaign.receivedAmount)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Mục tiêu: {formatCurrency(campaign.targetAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-2xl">
                      {campaign.donationCount || 0}
                    </span>
                    <span className="text-sm">lượt đóng góp</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:shadow-2xl dark:bg-[#1e293b] dark:border-gray-700">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#38bdf8] to-[#0ea5e9] rounded-full" />
                  Câu chuyện chiến dịch
                </h2>
                <div
                  className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: campaign.description || "<p>Không có mô tả</p>",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg dark:shadow-2xl sticky top-24 dark:bg-[#1e293b] dark:border-gray-700">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Thông tin chiến dịch
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-[#38bdf8]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-[#38bdf8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">
                        Địa điểm
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 break-words">
                        {campaign.location || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">
                        Mục tiêu
                      </p>
                      <p className="font-bold text-green-700 dark:text-green-400 text-lg">
                        {formatCurrency(campaign.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">
                        Ngày bắt đầu
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatDate(campaign.fundraisingStartDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">
                        Ngày kết thúc
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatDate(campaign.fundraisingEndDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
