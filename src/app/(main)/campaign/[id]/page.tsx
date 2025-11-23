"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { restoreSession } from "@/store/slices/auth-slice";
import { motion } from "framer-motion";
import Image from "next/image";

import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Loader } from "@/components/animate-ui/icons/loader";
import { getCampaignIdFromSlug, createCampaignSlug } from "@/lib/utils/slug-utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Users,
  DollarSign,
  CalendarDays,
  GoalIcon,
  Info,
  Share2,
} from "lucide-react";

import { ProgressBar } from "@/components/campaign/progress-bar";
import { BudgetBreakdown } from "@/components/campaign/budget-breakdown";
import { Timeline } from "@/components/campaign/timeline";
import { ActionPanel } from "@/components/campaign/action-panel";
import { coverSrc, toNumber } from "@/lib/utils/utils";
import { Stat } from "@/components/campaign/stat";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDate, formatDateTime } from "@/lib/utils/date-utils";
import { CampaignPosts } from "@/components/campaign/campaign-posts";
import { DonationList } from "@/components/campaign/donation-list";
import { ExpenseProofList } from "@/components/campaign/expense-proof-list";
import { MealBatchList } from "@/components/campaign/meal-batch-list";
import { DisbursementList } from "@/components/campaign/disbursement-list";

import { ShareDialog } from "@/components/campaign/share-dialog";

export default function CampaignDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("story");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?.id;

  useEffect(() => {
    // Try to restore session from localStorage/cookies
    dispatch(restoreSession());

    if (!id) return;
    (async () => {
      // Get actual ID from sessionStorage
      const slug = id as string;
      const actualId = getCampaignIdFromSlug(slug);
      
      if (!actualId) {
        setLoading(false);
        return;
      }
      
      const data = await campaignService.getCampaignById(actualId);
      setCampaign(data);
      setLoading(false);
    })();
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader animate loop className="h-8 w-8 text-color" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Không tìm thấy chiến dịch.
      </div>
    );
  }

  const raised = toNumber(campaign.receivedAmount, 0);
  const goal = Math.max(toNumber(campaign.targetAmount, 0), 1);
  const progress =
    typeof campaign.fundingProgress === "number"
      ? Math.round(campaign.fundingProgress)
      : Math.min(Math.round((raised / (goal || 1)) * 100), 100);
  const isFundingComplete = progress >= 100;
  const timeLeft =
    typeof campaign.daysRemaining === "number"
      ? campaign.daysRemaining
      : (() => {
        const now = new Date();
        const end = campaign.fundraisingEndDate
          ? new Date(campaign.fundraisingEndDate)
          : null;
        const start = campaign.fundraisingStartDate
          ? new Date(campaign.fundraisingStartDate)
          : null;
        if (!end) return "Không xác định";
        if (start && now < start) {
          const days = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return `Chưa bắt đầu (còn ${days} ngày)`;
        }
        if (now > end) return "Đã kết thúc";
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
      })();

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

  const handleDirection = () => {
    const slug = createCampaignSlug(campaign.title, campaign.id);
    router.push(`/map/${slug}`);
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  // ===== Timeline status helpers =====
  const now = new Date();
  const start = campaign.fundraisingStartDate
    ? new Date(campaign.fundraisingStartDate)
    : null;
  const end = campaign.fundraisingEndDate
    ? new Date(campaign.fundraisingEndDate)
    : null;

  const statusFor = (d?: string | null) => {
    if (!d) return "upcoming" as const;
    const t = new Date(d);
    return t <= now ? ("completed" as const) : ("upcoming" as const);
  };

  const isBeforeStart = start && now < start;
  const isAfterEnd = end && now >= end;
  const isDuringFundraising = start && end && now >= start && now < end;

  const fundraisingStartStatus = (() => {
    if (isFundingComplete) return "completed";
    if (!start) return "upcoming";
    if (isBeforeStart) return "upcoming";
    if (isDuringFundraising) return "current";
    return "completed";
  })();

  const fundraisingEndStatus = (() => {
    if (!start || !end) return "upcoming";
    if (isBeforeStart) return "upcoming";
    if (isDuringFundraising) return "upcoming"; // Don't show badge during fundraising
    if (isAfterEnd) return "completed";
    return "upcoming";
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }} // không dùng y để tránh transform chặn sticky
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto pt-30 pb-20 px-4 md:px-6">
        {/* HERO */}
        <div className="relative rounded-3xl overflow-hidden ring-1 ring-gray-200 shadow-sm mb-8">
          <Image
            src={coverSrc(campaign.coverImage)}
            alt={campaign.title}
            width={1600}
            height={900}
            priority
            className="object-cover mx-auto w-full h-[320px] md:h-[620px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {campaign.category?.title && (
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                {campaign.category.title}
              </Badge>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleShare}
                className="backdrop-blur bg-white/80"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="bg-color-base rounded-2xl shadow-sm border p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600 font-medium">
              Tiến độ gây quỹ
            </div>
            <div className="text-sm font-semibold text-[#ad4e28]">
              {progress}%
            </div>
          </div>

          <ProgressBar value={progress} />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 text-center mt-5">
            <Stat
              icon={<DollarSign className="mx-auto w-4 md:w-5 h-4 md:h-5" />}
              label="Đã nhận"
              value={formatCurrency(raised)}
              tone="text-green-600"
            />
            <Stat
              icon={<GoalIcon className="mx-auto w-4 md:w-5 h-4 md:h-5" />}
              label="Mục tiêu"
              value={formatCurrency(goal)}
              tone="text-yellow-600"
            />
            <Stat
              icon={<Users className="mx-auto w-4 md:w-5 h-4 md:h-5" />}
              label="Lượt đóng góp"
              value={String(campaign.donationCount ?? 0)}
              tone="text-blue-600"
            />
            <Stat
              icon={<CalendarDays className="mx-auto w-4 md:w-5 h-4 md:h-5" />}
              label="Ngày bắt đầu"
              value={formatDate(campaign.fundraisingStartDate)}
            />
            <Stat
              icon={<CalendarDays className="mx-auto w-4 md:w-5 h-4 md:h-5" />}
              label="Ngày kết thúc"
              value={formatDate(campaign.fundraisingEndDate)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
          <div>
            <h1 className="text-2xl md:text-3xl mb-4 font-bold text-color drop-shadow">
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

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6 h-auto">
                <TabsTrigger value="story" className="text-xs md:text-sm">Câu chuyện</TabsTrigger>
                <TabsTrigger value="posts" className="text-xs md:text-sm">Bài viết</TabsTrigger>
                <TabsTrigger value="meals" className="text-xs md:text-sm">Thức ăn</TabsTrigger>
                <TabsTrigger value="donations" className="text-xs md:text-sm">Ủng hộ</TabsTrigger>
                <TabsTrigger value="disbursements" className="text-xs md:text-sm">Giải ngân</TabsTrigger>
                <TabsTrigger value="expenses" className="text-xs md:text-sm">Chi phí</TabsTrigger>
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
                <CampaignPosts
                  campaignId={campaign.id}
                  currentUserId={currentUserId}
                />
              </TabsContent>

              <TabsContent value="meals">
                <div className="bg-white rounded-2xl border p-6">
                  <MealBatchList campaignId={campaign.id} />
                </div>
              </TabsContent>

              <TabsContent value="donations">
                <div className="bg-white rounded-2xl border p-6">
                  <DonationList campaignId={campaign.id} />
                </div>
              </TabsContent>

              <TabsContent value="disbursements">
                <div className="bg-white rounded-2xl border p-6">
                  {campaign.phases && campaign.phases.length > 0 ? (
                    <div className="space-y-6">
                      {campaign.phases.map((phase) => (
                        <div key={phase.id}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Giai đoạn: {phase.phaseName}
                          </h3>
                          <DisbursementList campaignPhaseId={phase.id} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Chiến dịch này chưa có giai đoạn nào
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="expenses">
                <div className="bg-white rounded-2xl border p-6">
                  <ExpenseProofList campaignId={campaign.id} />
                </div>
              </TabsContent>
            </Tabs>

            {/* BUDGET */}
            {hasBudget && (
              <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-color mb-1">
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
              campaignTitle={campaign.title}
              campaignStatus={campaign.status}
              organizationName={campaign.creator?.full_name}
              canEdit={campaign.status === "PENDING"}
              onEdit={() => {
                const slug = createCampaignSlug(campaign.title, campaign.id);
                router.push(`/profile/my-campaign/${slug}/edit`);
              }}
              goal={formatCurrency(goal)}
              onDirection={handleDirection}
              targetAmount={goal}
              raisedAmount={raised}
              daysLeft={timeLeft}
              fundraisingEndDate={campaign.fundraisingEndDate}
              campaignFundingProgress={campaign.fundingProgress}
            />

            <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-color mb-1">
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
                    status: fundraisingStartStatus,
                  },
                  ...(isFundingComplete
                    ? [
                      {
                        label: "Đã nhận đủ số tiền gây quỹ",
                        date: "Đã hoàn thành",
                        status: "completed" as const,
                      },
                    ]
                    : []),
                  {
                    label: "Kết thúc gây quỹ",
                    date: formatDateTime(campaign.fundraisingEndDate),
                    status: fundraisingEndStatus,
                    startDate: campaign.fundraisingStartDate,
                    endDate: campaign.fundraisingEndDate,
                  },
                  ...(campaign.phases || []).flatMap((phase) => [
                    {
                      label: `${phase.phaseName} - Mua nguyên liệu`,
                      date: formatDateTime(phase.ingredientPurchaseDate),
                      status: statusFor(phase.ingredientPurchaseDate),
                    },
                    {
                      label: `${phase.phaseName} - Nấu ăn`,
                      date: formatDateTime(phase.cookingDate),
                      status: statusFor(phase.cookingDate),
                    },
                    {
                      label: `${phase.phaseName} - Giao hàng`,
                      date: formatDateTime(phase.deliveryDate),
                      status: statusFor(phase.deliveryDate),
                    },
                  ]),
                ]}
              />
            </div>

          </aside>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        campaignTitle={campaign.title}
        campaignUrl={typeof window !== "undefined" ? window.location.href : ""}
        campaignDescription={campaign.description}
      />
    </motion.div>
  );
}
