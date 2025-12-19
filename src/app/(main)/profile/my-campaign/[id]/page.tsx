"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { restoreSession } from "../../../../../store/slices/auth-slice";
import Image from "next/image";

import { campaignService } from "../../../../../services/campaign.service";
import { phaseService } from "../../../../../services/phase.service";
import { Campaign } from "../../../../../types/api/campaign";
import { Loader } from "../../../../../components/animate-ui/icons/loader";

import { statusConfig } from "../../../../../lib/translator";
import { Badge } from "../../../../../components/ui/badge";
import { Button } from "../../../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import {
  MapPin,
  Users,
  DollarSign,
  CalendarDays,
  GoalIcon,
  Share2,
  Trash2,
  CheckCircle2,
  Utensils,
  Leaf
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../components/ui/tooltip";

import { ProgressBar } from "../../../../../components/campaign/progress-bar";
import { Stat } from "../../../../../components/campaign/stat";
import { BudgetBreakdown } from "../../../../../components/campaign/budget-breakdown";
import { Timeline } from "../../../../../components/campaign/timeline";
import { ActionPanel } from "../../../../../components/campaign/action-panel";
import { DeleteCampaignDialog } from "../../../../../components/campaign/delete-campaign-dialog";
import { toast } from "sonner";
import {
  calcDaysLeft,
  calcProgress,
  coverSrc,
  toNumber,
} from "../../../../../lib/utils/utils";
import { formatCurrency } from "../../../../../lib/utils/currency-utils";
import { formatDate, formatDateTime } from "../../../../../lib/utils/date-utils";
import { CampaignPosts } from "../../../../../components/campaign/campaign-posts";
import { CreatePostDialog } from "../../../../../components/campaign/create-post-dialog";
import { DonationList } from "../../../../../components/campaign/donation-list";
import { ExpenseProofList } from "../../../../../components/campaign/expense-proof-list";
import { Info, Plus } from "lucide-react";
import { CreateOperationRequestDialog } from "../../../../../components/campaign/create-operation-request-dialog";
import { CreateIngredientRequestDialog } from "../../../../../components/campaign/create-ingredient-request-dialog";
import { OperationRequestList } from "../../../../../components/campaign/operation-request-list";
import { IngredientRequestList } from "../../../../../components/campaign/ingredient-request-list";
import { MealBatchList } from "../../../../../components/campaign/meal-batch-list";
import { ShareDialog } from "../../../../../components/campaign/share-dialog";
import { ExtendCampaignDialog } from "../../../../../components/campaign/extend-campaign-dialog";
import { getCampaignIdFromSlug, createCampaignSlug } from "../../../../../lib/utils/slug-utils";
import { DeliveryTaskAssignmentTab } from "../../../../../components/campaign/delivery-task-assignment-tab";
import { DeliveryTasksTab } from "../../../../../components/campaign/tabs/delivery-tasks-tab";

export default function MyCampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("story");
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(0);
  const [isCreateOperationRequestDialogOpen, setIsCreateOperationRequestDialogOpen] = useState(false);
  const [isCreateIngredientRequestDialogOpen, setIsCreateIngredientRequestDialogOpen] = useState(false);
  const [refreshOperationRequests, setRefreshOperationRequests] = useState(0);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?.id;

  useEffect(() => {
    dispatch(restoreSession());

    if (!id) return;
    (async () => {
      try {
        // Get actual campaign ID from sessionStorage
        const slug = id as string;
        const campaignId = getCampaignIdFromSlug(slug);

        if (!campaignId) {
          setLoading(false);
          return;
        }

        const data = await campaignService.getCampaignById(campaignId);
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
  const progress = campaign.fundingProgress !== undefined ? campaign.fundingProgress : calcProgress(campaign.receivedAmount, campaign.targetAmount);
  const timeLeft = calcDaysLeft(
    campaign.fundraisingEndDate,
    campaign.fundraisingStartDate
  );
  const status = statusConfig[campaign.status];

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

  // Check if campaign can be extended
  const daysRemaining = parseInt(timeLeft) || 0;
  const fundingProgress = progress || 0;
  const canExtend =
    campaign.status === "ACTIVE" &&
    (daysRemaining <= 7 || fundingProgress < 70);

  const handleExtendCampaign = async (days: number) => {
    if (!campaign) return;

    try {
      const updated = await campaignService.extendCampaign(campaign.id, days);
      if (updated) {
        toast.success("Kéo dài thời gian gây quỹ thành công!", {
          description: `Chiến dịch đã được kéo dài thêm ${days} ngày.`,
        });
        // Refresh campaign data
        const data = await campaignService.getCampaignById(campaign.id);
        if (data) {
          setCampaign(data);
        }
      }
    } catch (error) {
      toast.error("Kéo dài thất bại!", {
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi.",
      });
    }
  };

  const handleUpdatePhaseStatus = async (phaseId: string, status: "COMPLETED") => {
    if (!campaign) return;
    if (!confirm("Bạn có chắc chắn muốn đánh dấu giai đoạn nãy đã hoàn thành?")) return;

    try {
      await phaseService.updatePhaseStatus({
        phaseId,
        status,
      });
      toast.success("Cập nhật trạng thái giai đoạn thành công!");

      // Refresh campaign data
      const data = await campaignService.getCampaignById(campaign.id);
      if (data) {
        setCampaign(data);
      }
    } catch (error) {
      toast.error("Cập nhật thất bại!", {
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi.",
      });
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
                onClick={() => setIsShareDialogOpen(true)}
                className="backdrop-blur bg-white/80"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Chia sẻ
              </Button>
              {canExtend && (
                <Button
                  onClick={() => setIsExtendDialogOpen(true)}
                  className="backdrop-blur bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Kéo dài thời gian
                </Button>
              )}
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
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto">
                <TabsTrigger value="story" className="text-xs md:text-sm">Câu chuyện</TabsTrigger>
                <TabsTrigger value="posts" className="text-xs md:text-sm">Bài viết</TabsTrigger>
                <TabsTrigger value="meals" className="text-xs md:text-sm">Thức ăn</TabsTrigger>
                <TabsTrigger value="donations" className="text-xs md:text-sm">Danh sách ủng hộ</TabsTrigger>
                <TabsTrigger value="expenses" className="text-xs md:text-sm">Chứng từ chi phí</TabsTrigger>
                <TabsTrigger value="operations" className="text-xs md:text-sm">Giải ngân</TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs md:text-sm">Giao việc</TabsTrigger>
                <TabsTrigger value="delivery-tasks" className="text-xs md:text-sm">Vận chuyển</TabsTrigger>
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

              <TabsContent value="meals">
                <div className="bg-white rounded-2xl border p-6">
                  {campaign.phases && campaign.phases.length > 0 ? (
                    <div className="space-y-6">
                      {campaign.phases.map((phase) => (
                        <div key={phase.id}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Giai đoạn: {phase.phaseName}
                          </h3>
                          <MealBatchList campaignPhaseId={phase.id} />
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
                <div className="mb-4 flex justify-end gap-2">
                  <Button
                    onClick={() => setIsCreateIngredientRequestDialogOpen(true)}
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                    disabled={!campaign.phases || campaign.phases.length === 0}
                  >
                    <Plus className="w-4 h-4" />
                    Mua nguyên liệu
                  </Button>
                  <Button
                    onClick={() => setIsCreateOperationRequestDialogOpen(true)}
                    className="gap-2 btn-color"
                    disabled={!campaign.phases || campaign.phases.length === 0}
                  >
                    <Plus className="w-4 h-4" />
                    Chi phí vận hành
                  </Button>
                </div>
                <div className="bg-white rounded-2xl border p-6">
                  {campaign.phases && campaign.phases.length > 0 ? (
                    <div className="space-y-8">
                      {campaign.phases.map((phase) => (
                        <div key={phase.id}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-green-600 rounded-full inline-block flex-shrink-0"></span>
                            <div className="flex-1 min-w-0">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="line-clamp-2 cursor-help text-left font-semibold">
                                      Giai đoạn: {phase.phaseName}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs break-words">Giai đoạn: {phase.phaseName}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </h3>
                          <OperationRequestList
                            campaignId={campaign.id}
                            campaignPhaseId={phase.id}
                            refreshKey={refreshOperationRequests}
                          />
                          <div className="mt-4"></div>
                          <IngredientRequestList
                            campaignId={campaign.id}
                            campaignPhaseId={phase.id}
                            refreshKey={refreshOperationRequests}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Chiến dịch này chưa có giai đoạn nào</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tasks">
                <DeliveryTaskAssignmentTab campaignId={campaign.id} />
              </TabsContent>

              <TabsContent value="delivery-tasks">
                <DeliveryTasksTab campaignId={campaign.id} />
              </TabsContent>
            </Tabs>

            {hasBudget && (
              <div className="bg-white rounded-2xl border p-6 mb-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Phân bổ ngân sách, dự kiến nguyên liệu và thức ăn
                  </h3>
                  <p className="text-sm text-gray-600">
                    Chi tiết phân bổ và sử dụng ngân sách, dự kiến nguyên liệu và thức ăn cho chiến dịch
                  </p>
                </div>
                <BudgetBreakdown
                  phases={campaign?.phases}
                  targetAmount={campaign?.targetAmount ? Number(campaign.targetAmount) : undefined}
                />
              </div>
            )}

            {/* Campaign Plan Summary */}
            {/* {campaign.phases && campaign.phases.length > 0 && (
              <CampaignPlanSummary phases={campaign.phases} />
            )} */}
          </div>

          <aside className="space-y-6 sticky top-28 h-fit self-start">
            <ActionPanel
              campaignId={campaign.id}
              campaignTitle={campaign.title}
              campaignStatus={campaign.status}
              organizationName={campaign?.organization?.name}
              canEdit={campaign.status === "PENDING"}
              onEdit={() => {
                const slug = createCampaignSlug(campaign.title, campaign.id);
                router.push(`/profile/my-campaign/${slug}/edit`);
              }}
              goal={formatCurrency(goal)}
              targetAmount={goal}
              raisedAmount={raised}
              campaignFundingProgress={campaign.fundingProgress}
              daysLeft={timeLeft}
              fundraisingEndDate={campaign.fundraisingEndDate}
              reason={campaign.reason}
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
              {(() => {
                // Helper to parse ISO string without timezone conversion
                const parseLocalDateTime = (isoString?: string): Date | null => {
                  if (!isoString) return null;
                  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
                  if (match) {
                    return new Date(
                      parseInt(match[1]),
                      parseInt(match[2]) - 1,
                      parseInt(match[3]),
                      parseInt(match[4]),
                      parseInt(match[5])
                    );
                  }
                  return new Date(isoString);
                };

                const now = new Date();
                const fundStart = parseLocalDateTime(campaign.fundraisingStartDate);
                const fundEnd = parseLocalDateTime(campaign.fundraisingEndDate);

                return (
                  <Timeline
                    items={[
                      {
                        label: "Tạo chiến dịch",
                        date: formatDateTime(new Date(campaign.created_at)),
                        status: "completed",
                      },
                      {
                        label: "Bắt đầu gây quỹ",
                        date: formatDateTime(campaign.fundraisingStartDate),
                        status:
                          Math.round(progress) >= 100
                            ? "completed"
                            : fundEnd && fundEnd <= now
                              ? "completed"
                              : fundStart && fundEnd && fundStart <= now && now < fundEnd
                                ? "current"
                                : "upcoming",
                      },
                      {
                        label: "Kết thúc gây quỹ",
                        date: formatDateTime(campaign.fundraisingEndDate),
                        status:
                          (fundEnd && fundEnd <= now) ||
                            campaign.status === "PROCESSING" ||
                            campaign.status === "COMPLETED" ||
                            Math.round(progress) >= 100
                            ? "completed"
                            : "upcoming",
                      },
                      ...(campaign.phases || []).flatMap((phase) => [
                        {
                          label: `${phase.phaseName} - Mua nguyên liệu`,
                          date: formatDateTime(phase.ingredientPurchaseDate),
                          status: (phase.ingredientPurchaseDate && parseLocalDateTime(phase.ingredientPurchaseDate) && parseLocalDateTime(phase.ingredientPurchaseDate)! <= now ? "completed" : "upcoming") as "completed" | "upcoming",
                          content: (
                            <div className="mt-2 space-y-2">
                              {phase.plannedIngredients && phase.plannedIngredients.length > 0 && (
                                <div className="bg-green-50 p-2 rounded border border-green-100">
                                  <div className="flex items-center gap-1 text-xs font-medium text-green-700 mb-1">
                                    <Leaf className="w-3 h-3" />
                                    <span>Nguyên liệu dự kiến</span>
                                  </div>
                                  <ul className="space-y-1">
                                    {phase.plannedIngredients.map((ing, idx) => (
                                      <li key={idx} className="text-xs text-gray-700 flex justify-between">
                                        <span className="truncate max-w-[120px]" title={ing.name}>{ing.name}</span>
                                        <span className="font-medium whitespace-nowrap">{ing.quantity} {ing.unit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )
                        },
                        {
                          label: `${phase.phaseName} - Nấu ăn`,
                          date: formatDateTime(phase.cookingDate),
                          status: (phase.cookingDate && parseLocalDateTime(phase.cookingDate) && parseLocalDateTime(phase.cookingDate)! <= now ? "completed" : "upcoming") as "completed" | "upcoming",
                          content: (
                            <div className="mt-2 space-y-2">
                              {phase.plannedMeals && phase.plannedMeals.length > 0 && (
                                <div className="bg-orange-50 p-2 rounded border border-orange-100">
                                  <div className="flex items-center gap-1 text-xs font-medium text-orange-700 mb-1">
                                    <Utensils className="w-3 h-3" />
                                    <span>Món ăn dự kiến</span>
                                  </div>
                                  <ul className="space-y-1">
                                    {phase.plannedMeals.map((meal, idx) => (
                                      <li key={idx} className="text-xs text-gray-700 flex justify-between">
                                        <span>{meal.name}</span>
                                        <span className="font-medium">x{meal.quantity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )
                        },
                        {
                          label: `${phase.phaseName} - Giao hàng`,
                          date: formatDateTime(phase.deliveryDate),
                          status: (phase.deliveryDate && parseLocalDateTime(phase.deliveryDate) && parseLocalDateTime(phase.deliveryDate)! <= now ? "completed" : "upcoming") as "completed" | "upcoming",
                          content: (
                            <div className="mt-2 space-y-2">
                              {phase.status === "DELIVERY" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 mb-2"
                                  onClick={() => handleUpdatePhaseStatus(phase.id, "COMPLETED")}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Đánh dấu hoàn thành
                                </Button>
                              )}
                            </div>
                          )
                        },
                      ]),
                    ]}
                  />
                );
              })()}

            </div>
          </aside>
        </div >
      </div >

      {/* Delete Campaign Dialog */}
      < DeleteCampaignDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)
        }
        onConfirm={handleDeleteCampaign}
        campaignTitle={campaign.title}
      />

      {/* Create Post Dialog */}
      < CreatePostDialog
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

      {/* Create Ingredient Request Dialog */}
      <CreateIngredientRequestDialog
        isOpen={isCreateIngredientRequestDialogOpen}
        onClose={() => setIsCreateIngredientRequestDialogOpen(false)}
        campaignId={campaign.id}
        phases={campaign.phases || []}
        onSuccess={() => setRefreshOperationRequests((prev) => prev + 1)}
      />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        campaignTitle={campaign.title}
        campaignUrl={typeof window !== "undefined" ? window.location.href : ""}
        campaignDescription={campaign.description}
      />

      {/* Extend Campaign Dialog */}
      {
        campaign.fundraisingEndDate && (
          <ExtendCampaignDialog
            isOpen={isExtendDialogOpen}
            onClose={() => setIsExtendDialogOpen(false)}
            onConfirm={handleExtendCampaign}
            currentEndDate={campaign.fundraisingEndDate}
          />
        )
      }
    </div >
  );
}
