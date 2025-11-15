"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { restoreSession } from "@/store/slices/auth-slice";
import Image from "next/image";

import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Loader } from "@/components/animate-ui/icons/loader";

import { statusConfig } from "@/lib/translator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Users,
  DollarSign,
  CalendarDays,
  GoalIcon,
  Share2,
  Copy,
  Trash2,
} from "lucide-react";

import { ProgressBar } from "@/components/campaign/progress-bar";
import { Stat } from "@/components/campaign/stat";
import { BudgetBreakdown } from "@/components/campaign/budget-breakdown";
import { Timeline } from "@/components/campaign/timeline";
import { ActionPanel } from "@/components/campaign/action-panel";
import { OrganizerCard } from "@/components/campaign/organization-card";
import { DeleteCampaignDialog } from "@/components/campaign/delete-campaign-dialog";
import { toast } from "sonner";
import {
  calcDaysLeft,
  calcProgress,
  coverSrc,
  toNumber,
} from "@/lib/utils/utils";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDate, formatDateTime } from "@/lib/utils/date-utils";
import { CampaignPosts } from "@/components/campaign/campaign-posts";
import { CreatePostDialog } from "@/components/campaign/create-post-dialog";
import { DonationList } from "@/components/campaign/donation-list";
import { ExpenseProofList } from "@/components/campaign/expense-proof-list";
import { Info, Plus } from "lucide-react";
import { CreateOperationRequestDialog } from "@/components/campaign/create-operation-request-dialog";
import { OperationRequestList } from "@/components/campaign/operation-request-list";

export default function MyCampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("story");
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(0);
  const [isCreateOperationRequestDialogOpen, setIsCreateOperationRequestDialogOpen] = useState(false);
  const [refreshOperationRequests, setRefreshOperationRequests] = useState(0);

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?.id;

  useEffect(() => {
    // Try to restore session from localStorage/cookies
    dispatch(restoreSession());

    if (!id) return;
    (async () => {
      try {
        const data = await campaignService.getCampaignById(id as string);
        setCampaign(data);
      } catch (err) {
        console.error("Error fetching campaign:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader animate loop className="h-8 w-8 text-color" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Không tìm thấy chiến dịch.
      </div>
    );
  }

  const raised = toNumber(campaign.receivedAmount, 0);
  const goal = Math.max(toNumber(campaign.targetAmount, 0), 1);
  const progress = calcProgress(campaign.receivedAmount, campaign.targetAmount);
  const timeLeft = calcDaysLeft(
    campaign.fundraisingEndDate,
    campaign.fundraisingStartDate
  );
  const status = statusConfig[campaign.status];

  // Calculate total budget percentages from all phases
  const totalIngredientPct = campaign.phases?.reduce(
    (sum, phase) => sum + toNumber(phase.ingredientBudgetPercentage, 0),
    0
  ) || 0;
  const totalCookingPct = campaign.phases?.reduce(
    (sum, phase) => sum + toNumber(phase.cookingBudgetPercentage, 0),
    0
  ) || 0;
  const totalDeliveryPct = campaign.phases?.reduce(
    (sum, phase) => sum + toNumber(phase.deliveryBudgetPercentage, 0),
    0
  ) || 0;

  const ingredientAmt = Math.round((totalIngredientPct / 100) * goal);
  const cookingAmt = Math.round((totalCookingPct / 100) * goal);
  const deliveryAmt = Math.round((totalDeliveryPct / 100) * goal);

  const hasBudget =
    ingredientAmt > 0 ||
    cookingAmt > 0 ||
    deliveryAmt > 0;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: campaign.title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaign) return;

    try {
      const success = await campaignService.deleteCampaign(campaign.id);
      if (success) {
        toast.success("Xóa chiến dịch thành công!", {
          description: `Chiến dịch "${campaign.title}" đã được xóa.`,
        });
        router.push("/profile?tab=campaigns");
      } else {
        toast.error("Xóa thất bại!", {
          description: "Không thể xóa chiến dịch, vui lòng thử lại.",
        });
      }
    } catch (error) {
      toast.error("Xóa thất bại!", {
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden ring-1 ring-gray-200 shadow-sm mb-8">
          <Image
            src={coverSrc(campaign.coverImage)}
            alt={campaign.title}
            width={1600}
            height={900}
            priority
            className="object-cover w-full h-[320px] md:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge
              className={`${status.color} flex items-center gap-1 border-0 shadow`}
            >
              <status.icon className="w-4 h-4" /> {status.label}
            </Badge>
            {campaign.category?.title && (
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                {campaign.category.title}
              </Badge>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                onClick={handleShare}
                className="backdrop-blur bg-white/80"
              >
                {copied ? (
                  <Copy className="w-4 h-4 mr-2" />
                ) : (
                  <Share2 className="w-4 h-4 mr-2" />
                )}
                {copied ? "Đã sao chép" : "Chia sẻ"}
              </Button>
              <Button
                onClick={() =>
                  router.push(`/campaign/${campaign.id}/donations`)
                }
                variant="outline"
                className="bg-white/80 backdrop-blur border-white/70"
              >
                Xem quyên góp
              </Button>
              {(campaign.status === "REJECTED" || campaign.status === "PENDING") && (
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-600 hover:bg-red-700 backdrop-blur"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa chiến dịch
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600 font-medium">
              Tiến độ gây quỹ
            </div>
            <div className="text-sm font-semibold text-[#ad4e28]">
              {progress}%
            </div>
          </div>

          <ProgressBar value={progress} />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center mt-5">
            <Stat
              icon={<DollarSign className="mx-auto w-5 h-5" />}
              label="Đã nhận"
              value={formatCurrency(raised)}
              tone="text-green-600"
            />
            <Stat
              icon={<GoalIcon className="mx-auto w-5 h-5" />}
              label="Mục tiêu"
              value={formatCurrency(goal)}
              tone="text-yellow-600"
            />
            <Stat
              icon={<Users className="mx-auto w-5 h-5" />}
              label="Lượt đóng góp"
              value={String(campaign.donationCount ?? 0)}
              tone="text-blue-600"
            />
            <Stat
              icon={<CalendarDays className="mx-auto w-5 h-5" />}
              label="Ngày bắt đầu"
              value={formatDate(campaign.fundraisingStartDate)}
            />
            <Stat
              icon={<CalendarDays className="mx-auto w-5 h-5" />}
              label="Ngày kết thúc"
              value={formatDate(campaign.fundraisingEndDate)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-color mb-4 drop-shadow">
              {campaign.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-5 text-sm text-gray-600">
              {campaign.phases && campaign.phases.length > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                  <MapPin className="w-4 h-4" /> 
                  {campaign.phases.length === 1 
                    ? campaign.phases[0].location 
                    : `${campaign.phases.length} địa điểm`}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                <CalendarDays className="w-4 h-4" />
                Còn lại: <b className="ml-1">{timeLeft}</b>
              </span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="story">Câu chuyện</TabsTrigger>
                <TabsTrigger value="posts">Bài viết</TabsTrigger>
                <TabsTrigger value="donations">Danh sách ủng hộ</TabsTrigger>
                <TabsTrigger value="expenses">Chứng từ chi phí</TabsTrigger>
                <TabsTrigger value="operations">Giải ngân</TabsTrigger>
              </TabsList>

              <TabsContent value="story">
                <div className="bg-white rounded-2xl border p-6">
                  <div className="mb-4 flex items-center gap-2 text-gray-800">
                    <Info className="w-4 h-4" />
                    <h3 className="font-semibold">Mô tả chiến dịch</h3>
                  </div>
                  {campaign.description ? (
                    <div
                      className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: campaign.description }}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      Chưa có mô tả chi tiết.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="posts">
                <div className="mb-4 flex justify-end">
                  <Button
                    onClick={() => setIsCreatePostDialogOpen(true)}
                    className="gap-2 btn-color"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo bài viết mới
                  </Button>
                </div>
                <CampaignPosts
                  campaignId={campaign.id}
                  currentUserId={currentUserId}
                  key={refreshPosts}
                />
              </TabsContent>

              <TabsContent value="donations">
                <div className="bg-white rounded-2xl border p-6">
                  <DonationList campaignId={campaign.id} />
                </div>
              </TabsContent>

              <TabsContent value="expenses">
                <div className="bg-white rounded-2xl border p-6">
                  <ExpenseProofList campaignId={campaign.id} />
                </div>
              </TabsContent>

              <TabsContent value="operations">
                <div className="mb-4 flex justify-end">
                  <Button
                    onClick={() => setIsCreateOperationRequestDialogOpen(true)}
                    className="gap-2 btn-color"
                    disabled={!campaign.phases || campaign.phases.length === 0}
                  >
                    <Plus className="w-4 h-4" />
                    Tạo yêu cầu giải ngân
                  </Button>
                </div>
                <div className="bg-white rounded-2xl border p-6">
                  <OperationRequestList 
                    campaignId={campaign.id} 
                    refreshKey={refreshOperationRequests}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {hasBudget && (
              <div className="bg-white rounded-2xl border p-6 mb-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Phân bổ ngân sách
                  </h3>
                  <p className="text-sm text-gray-600">
                    Chi tiết phân bổ và sử dụng ngân sách cho chiến dịch
                  </p>
                </div>
                <BudgetBreakdown
                  phases={campaign?.phases}
                  targetAmount={campaign?.targetAmount ? Number(campaign.targetAmount) : undefined}
                />
              </div>
            )}
          </div>

          <aside className="space-y-6 sticky top-28 h-fit self-start">
            <ActionPanel
              campaignId={campaign.id}
              campaignStatus={campaign.status}
              organizationName={campaign.creator.full_name}
              canEdit={campaign.status === "PENDING"}
              onEdit={() =>
                router.push(`/profile/my-campaign/${campaign.id}/edit`)
              }
              goal={formatCurrency(goal)}
              targetAmount={goal}
              raisedAmount={raised}
              daysLeft={timeLeft}
            />

            <OrganizerCard
              name={campaign.creator?.full_name}
              email={campaign.creator?.email}
              phone={campaign.creator?.phone_number}
            />

            {/* Timeline */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Mốc thời gian
                </h3>
                <p className="text-sm text-gray-600">
                  Lộ trình thực hiện chiến dịch từ đầu đến cuối
                </p>
              </div>
              <Timeline
                items={[
                  {
                    label: "Tạo chiến dịch",
                    date: formatDateTime(campaign.created_at),
                    status: "completed",
                  },
                  {
                    label: "Bắt đầu gây quỹ",
                    date: formatDateTime(campaign.fundraisingStartDate),
                    status:
                      campaign.fundraisingEndDate &&
                        new Date(campaign.fundraisingEndDate) <= new Date()
                        ? "completed"
                        : campaign.fundraisingStartDate &&
                          campaign.fundraisingEndDate &&
                          new Date(campaign.fundraisingStartDate) <=
                          new Date() &&
                          new Date() < new Date(campaign.fundraisingEndDate)
                          ? "current"
                          : "upcoming",
                  },
                  {
                    label: "Kết thúc gây quỹ",
                    date: formatDateTime(campaign.fundraisingEndDate),
                    status:
                      campaign.fundraisingEndDate &&
                        new Date(campaign.fundraisingEndDate) <= new Date()
                        ? "current"
                        : "upcoming",
                  },
                  ...(campaign.phases || []).flatMap((phase) => [
                    {
                      label: `${phase.phaseName} - Mua nguyên liệu`,
                      date: formatDateTime(phase.ingredientPurchaseDate),
                      status: (phase.ingredientPurchaseDate && new Date(phase.ingredientPurchaseDate) <= new Date() ? "completed" : "upcoming") as "completed" | "upcoming",
                    },
                    {
                      label: `${phase.phaseName} - Nấu ăn`,
                      date: formatDateTime(phase.cookingDate),
                      status: (phase.cookingDate && new Date(phase.cookingDate) <= new Date() ? "completed" : "upcoming") as "completed" | "upcoming",
                    },
                    {
                      label: `${phase.phaseName} - Giao hàng`,
                      date: formatDateTime(phase.deliveryDate),
                      status: (phase.deliveryDate && new Date(phase.deliveryDate) <= new Date() ? "completed" : "upcoming") as "completed" | "upcoming",
                    },
                  ]),
                ]}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Delete Campaign Dialog */}
      <DeleteCampaignDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCampaign}
        campaignTitle={campaign.title}
      />

      {/* Create Post Dialog */}
      <CreatePostDialog
        isOpen={isCreatePostDialogOpen}
        onClose={() => setIsCreatePostDialogOpen(false)}
        campaignId={campaign.id}
        onSuccess={() => setRefreshPosts((prev) => prev + 1)}
      />

      {/* Create Operation Request Dialog */}
      <CreateOperationRequestDialog
        isOpen={isCreateOperationRequestDialogOpen}
        onClose={() => setIsCreateOperationRequestDialogOpen(false)}
        campaignPhases={campaign.phases || []}
        onSuccess={() => setRefreshOperationRequests((prev) => prev + 1)}
      />
    </div>
  );
}
