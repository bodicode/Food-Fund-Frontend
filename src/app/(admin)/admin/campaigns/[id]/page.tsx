"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { campaignService } from "../../../../../services/campaign.service";
import { Campaign } from "../../../../../types/api/campaign";
import { userService } from "../../../../../services/user.service";
import { UserProfile } from "../../../../../types/api/user";
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Loader } from "../../../../../components/animate-ui/icons/loader";
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
  Utensils,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { statusConfig } from "../../../../../lib/translator";
import { formatDate, formatDateTime } from "../../../../../lib/utils/date-utils";
import { getCampaignIdFromSlug, titleToSlug } from "../../../../../lib/utils/slug-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Textarea } from "../../../../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { DonationList } from "../../../../../components/campaign/donation-list";
import { CampaignPosts } from "../../../../../components/campaign/campaign-posts";
import { MealBatchList } from "../../../../../components/campaign/meal-batch-list";
import { DisbursementList } from "../../../../../components/campaign/disbursement-list";
import { ExpenseProofList } from "../../../../../components/campaign/expense-proof-list";
import { DeliveryTasksTab } from "../../../../../components/campaign/tabs/delivery-tasks-tab";

export default function AdminCampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<Campaign["status"] | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Get actual campaign ID from sessionStorage
        const slug = id as string;
        const campaignId = getCampaignIdFromSlug(slug);

        // If no ID found from session/slug, try to find by searching with the slug
        if (!campaignId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(campaignId)) {
          // It's likely a slug, not an ID. Try to search for it.
          // 1. Convert slug back to approximate title (replace hyphens with spaces)
          const searchTerm = slug.replace(/-/g, " ");

          try {
            const searchResult = await campaignService.searchCampaigns({
              query: searchTerm,
              limit: 20 // Fetch a few to ensure we find the right one
            });

            if (searchResult && searchResult.items.length > 0) {
              // 2. Find the exact match by re-slugifying the titles
              const matchedCampaign = searchResult.items.find((c: Campaign) => titleToSlug(c.title) === slug);
              if (matchedCampaign) {
                setCampaign(matchedCampaign);
                setLoading(false);
                return;
              }
            }
          } catch (searchError) {
            console.error("Fallback search failed:", searchError);
          }
        }

        // If we still have an ID (either original or we failed to find by slug but want to try anyway)
        // Note: If campaignId was just the slug and search failed, this getCampaignById will likely fail too or return null, which is fine.
        if (campaignId) {
          const data = await campaignService.getCampaignById(campaignId);
          if (data) {
            setCampaign(data);
            setLoading(false);
            return;
          }
        }

        throw new Error("Không tìm thấy chiến dịch.");
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin chiến dịch.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const user = await userService.getMyProfile();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchData();
    fetchUser();
  }, [id]);

  const formatCurrency = (amount?: string | number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const handleStatusChange = async (status: Campaign["status"]) => {
    if (!campaign) return;

    if (status === "REJECTED" || status === "CANCELLED") {
      setPendingStatus(status);
      setIsRejectDialogOpen(true);
      return;
    }

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

  const handleConfirmReject = async () => {
    if (!campaign || !pendingStatus) return;

    if (!rejectionReason.trim()) {
      toast.error("Vui lòng nhập lý do");
      return;
    }

    setIsUpdating(true);
    try {
      await campaignService.changeStatus(
        campaign.id,
        pendingStatus,
        rejectionReason
      );
      toast.success(
        `Đã cập nhật trạng thái thành ${statusConfig[pendingStatus].label}`
      );
      const updated = await campaignService.getCampaignById(campaign.id);
      setCampaign(updated);
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setPendingStatus(null);
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật trạng thái.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto">
              <Loader animate="spin" className="w-8 h-8 text-blue-600" />
            </div>
            <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 -z-10 animate-pulse" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">Đang tải thông tin</p>
            <p className="text-sm text-gray-400">Vui lòng đợi trong giây lát...</p>
          </div>
        </div>
      </div>
    );

  if (!campaign)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-8">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-medium text-gray-900 dark:text-white">
              Lỗi dữ liệu
            </h3>
            <p className="text-gray-500 font-normal leading-relaxed">
              Chúng tôi không thể tìm thấy thông tin chi tiết về chiến dịch quyên góp này. Có thể nó đã bị xóa hoặc đường dẫn không chính xác.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/campaigns")}
            className="h-14 px-8 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-300 font-medium transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );

  const progress =
    campaign.fundingProgress !== undefined
      ? campaign.fundingProgress
      : (Number(campaign.receivedAmount) / Number(campaign.targetAmount)) * 100 || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors relative pt-12">

      <div className="relative z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/campaigns")}
              className="border-slate-200 dark:border-slate-800 rounded-2xl h-12 px-6 font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại danh sách
            </Button>

            <div className="flex flex-wrap gap-3">
              {campaign.status === "PENDING" && (
                <>
                  <Button
                    onClick={() => handleStatusChange("APPROVED")}
                    disabled={isUpdating}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-2xl h-12 px-6 font-medium transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Duyệt chiến dịch
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("REJECTED")}
                    disabled={isUpdating}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 px-6 font-medium transition-all shadow-lg shadow-red-600/20"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Từ chối
                  </Button>
                </>
              )}

              {campaign.status === "ACTIVE" && (
                <Button
                  onClick={() => handleStatusChange("CANCELLED")}
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 px-6 font-medium transition-all shadow-lg shadow-red-600/20"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Hủy chiến dịch
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className={`${statusConfig[campaign.status].color} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm`}
              >
                {statusConfig[campaign.status].label}
              </Badge>
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 border-slate-200 uppercase tracking-widest">
                {campaign.category?.title || "Chung"}
              </Badge>
              <div className="px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-medium uppercase tracking-widest">
                ID: <span className="text-slate-600 dark:text-slate-200 font-mono tracking-normal lowercase">{campaign.id}</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
              {campaign.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-20 relative z-20 space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Image Card Container */}
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group shadow-sm transition-all duration-300">
              <div className="relative w-full h-[400px] sm:h-[500px]">
                <Image
                  src={campaign.coverImage || ""}
                  alt={campaign.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>

            {/* Progress Card */}
            <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Tiến độ quyên góp
                    </p>
                    <h3 className="text-4xl font-semibold text-gray-900 dark:text-white">
                      {progress.toFixed(1)}%
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">Đóng góp</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {campaign.donationCount || 0} <span className="text-sm text-gray-400 font-normal">lượt</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Đã nhận được</p>
                      <p className="text-xl font-semibold text-emerald-600">
                        {formatCurrency(campaign.receivedAmount)}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Mục tiêu chiến dịch</p>
                      <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(campaign.targetAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="flex flex-wrap h-auto p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1 mb-6 border border-slate-100 dark:border-slate-800">
                {[
                  { id: "details", label: "Chi tiết", icon: Clock },
                  { id: "posts", label: "Bài viết", icon: TrendingUp },
                  { id: "meals", label: "Hoạt động", icon: Utensils },
                  { id: "donations", label: "Ủng hộ", icon: Users },
                  { id: "disbursements", label: "Giải ngân", icon: DollarSign },
                  { id: "expenses", label: "Hóa đơn", icon: ShieldCheck },
                  { id: "delivery-tasks", label: "Vận chuyển", icon: MapPin },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="rounded-xl flex-1 min-w-[120px] py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all text-sm font-semibold"
                    >
                      <Icon className="w-4.5 h-4.5 mr-2.5" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="details" className="mt-0">
                <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm">
                  <CardContent className="p-8 sm:p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Câu chuyện chiến dịch</h2>
                        <p className="text-sm text-gray-400 font-normal">Sứ mệnh và niềm tin gửi gắm qua từng con chữ</p>
                      </div>
                    </div>
                    <div
                      className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-relaxed dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: campaign.description || "<p>Không có mô tả</p>",
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts" className="mt-0">
                <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm">
                  <CardContent className="p-8">
                    <CampaignPosts campaignId={campaign?.id || ""} currentUserId={currentUser?.id} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="meals" className="mt-0">
                <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm">
                  <CardContent className="p-10">
                    {campaign.phases && campaign.phases.length > 0 ? (
                      <div className="space-y-12">
                        {campaign.phases.map((phase) => (
                          <div key={phase.id} className="relative pl-10">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100 dark:bg-slate-800" />
                            <div className="absolute left-[-4px] top-0 w-2 h-8 bg-blue-500 rounded-full" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                              Giai đoạn: {phase.phaseName}
                            </h3>
                            <MealBatchList campaignPhaseId={phase.id} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Utensils className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-normal">Chiến dịch này chưa có hoạt động thực phẩm nào</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="donations" className="mt-0">
                <Card className="border border-gray-100 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Lịch sử ủng hộ</h2>
                        <p className="text-sm text-gray-400 font-normal">Sự đồng lòng từ cộng đồng cho chiến dịch</p>
                      </div>
                    </div>
                    <DonationList campaignId={campaign.id} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="disbursements" className="mt-0">
                <Card className="border border-gray-100 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                  <CardContent className="p-8">
                    {campaign.phases && campaign.phases.length > 0 ? (
                      <div className="space-y-10">
                        {campaign.phases.map((phase) => (
                          <div key={phase.id}>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-amber-500" />
                              Giai đoạn: {phase.phaseName}
                            </h3>
                            <DisbursementList campaignPhaseId={phase.id} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <p className="text-gray-400 font-normal">Chưa có thông tin giải ngân</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="expenses" className="mt-0">
                <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm">
                  <CardContent className="p-8">
                    <ExpenseProofList campaignId={campaign.id} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="delivery-tasks" className="mt-0">
                <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm">
                  <CardContent className="p-8">
                    <DeliveryTasksTab campaignId={campaign.id} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden sticky top-8 shadow-sm">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin cốt lõi</h3>
                  <div className="space-y-4">
                    <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Quy mô</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {campaign.phases?.length || 0} giai đoạn chính
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-600">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-emerald-600/70 uppercase tracking-widest mb-0.5">Tiền huy động</p>
                        <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(campaign.targetAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Lộ trình</p>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          {formatDate(campaign.fundraisingStartDate)} - {formatDate(campaign.fundraisingEndDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Trách nhiệm tổ chức</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-base">
                        {campaign.organization?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400 font-normal">Đơn vị chủ trì thực hiện</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Đại diện</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {campaign.organization?.representative?.full_name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Liên hệ</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {campaign.organization?.phone_number || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Ngày khởi tạo</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {formatDateTime(campaign.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Timeline Card */}
            {campaign.phases && campaign.phases.length > 0 && (
              <Card className="border border-white/40 bg-white/40 backdrop-blur-xl dark:bg-slate-900/40 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    Chi tiết các giai đoạn
                  </h3>
                  <div className="space-y-8">
                    {campaign.phases.map((phase, index) => (
                      <div key={phase.id || index} className="group p-6 rounded-[2rem] bg-white/50 dark:bg-slate-800/30 border border-white/60 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {phase.phaseName}
                          </h4>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <p className="text-xs text-gray-500 font-normal leading-relaxed">{phase.location || "Chưa cập nhật địa điểm"}</p>
                          </div>

                          <div className="flex flex-col gap-4 pt-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Nguyên liệu</span>
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{formatDateTime(phase.ingredientPurchaseDate)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Nấu ăn & Giao hàng</span>
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{formatDateTime(phase.cookingDate)} - {formatDateTime(phase.deliveryDate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Planned Items */}
                        <div className="grid grid-cols-1 gap-3">
                          {phase.plannedMeals && phase.plannedMeals.length > 0 && (
                            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl p-4">
                              <h5 className="text-[10px] font-medium text-amber-700 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Utensils className="w-3 h-3" />
                                Thực đơn
                              </h5>
                              <div className="space-y-2">
                                {phase.plannedMeals.map((meal, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">{meal.name}</span>
                                    <span className="bg-white dark:bg-slate-900 text-amber-600 px-2 py-0.5 rounded-lg font-semibold border border-amber-100 dark:border-amber-900/30">x{meal.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {phase.plannedIngredients && phase.plannedIngredients.length > 0 && (
                            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl p-4">
                              <h5 className="text-[10px] font-medium text-emerald-700 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Leaf className="w-3 h-3" />
                                Nguyên liệu
                              </h5>
                              <div className="space-y-2">
                                {phase.plannedIngredients.map((ing, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold truncate max-w-[150px]">{ing.name}</span>
                                    <span className="bg-white dark:bg-slate-900 text-emerald-600 px-2 py-0.5 rounded-lg font-semibold border border-emerald-100 dark:border-emerald-900/30">{ing.quantity} {ing.unit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={isRejectDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsRejectDialogOpen(false);
            setRejectionReason("");
            setPendingStatus(null);
          }
        }}
      >
        <DialogContent className="rounded-[2rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {pendingStatus === "CANCELLED"
                ? "Hủy chiến dịch"
                : "Từ chối chiến dịch"}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-normal">
              Vui lòng nhập lý do{" "}
              {pendingStatus === "CANCELLED" ? "hủy" : "từ chối"} chiến dịch này.
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Nhập lý do chi tiết..."
              className="min-h-[120px] rounded-2xl bg-gray-50 border-gray-100 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isUpdating}
              className="rounded-xl flex-1 hover:bg-gray-100"
            >
              Hủy bỏ
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={isUpdating || !rejectionReason.trim()}
              className="rounded-xl flex-1 bg-red-600 hover:bg-red-700"
            >
              {isUpdating && <Loader animate="spin" className="w-4 h-4 mr-2" />}
              Xác nhận thực hiện
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
