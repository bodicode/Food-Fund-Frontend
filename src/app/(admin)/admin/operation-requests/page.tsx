"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { operationRequestService } from "../../../../services/operation-request.service";
import { ingredientRequestService } from "../../../../services/ingredient-request.service";
import { campaignService } from "../../../../services/campaign.service";
import { OperationRequest, OperationRequestSortOrder, OperationRequestStats } from "../../../../types/api/operation-request";
import { Campaign } from "../../../../types/api/campaign";
import { IngredientRequest, IngredientRequestStats } from "../../../../types/api/ingredient-request";
import { createCampaignSlug } from "../../../../lib/utils/slug-utils";
import { Loader } from "../../../../components/animate-ui/icons/loader";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { formatCurrency } from "../../../../lib/utils/currency-utils";
import { formatDateTime } from "../../../../lib/utils/date-utils";
import {
  DollarSign,
  Calendar,
  User,
  Package,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ExternalLink,
  Send,
  ShoppingCart,
  Eye,
  Truck,
  Utensils,
} from "lucide-react";
import { UpdateOperationRequestDialog } from "../../../../components/admin/update-operation-request-dialog";
import { CreateDisbursementDialog } from "../../../../components/admin/create-disbursement-dialog";
import { AdminIngredientRequestDetailDialog } from "../../../../components/admin";
import { DisbursementDetailDialog } from "../../../../components/admin/disbursement-detail-dialog";
import { RequestDetailDialog } from "../../../../components/admin/request-detail-dialog";
import { disbursementService } from "../../../../services/disbursement.service";
import { toast } from "sonner";

type TabType = "ingredient" | "cooking" | "delivery";

const statusLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  APPROVED: { label: "Đã duyệt", color: "bg-green-100 text-green-800", icon: CheckCircle },
  REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-800", icon: XCircle },
  DISBURSED: { label: "Đã giải ngân", color: "bg-blue-100 text-blue-800", icon: Send },
};

export default function OperationRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ingredient");

  // Operation requests state (Shared for Cooking and Delivery types)
  const [operationRequests, setOperationRequests] = useState<OperationRequest[]>([]);
  const [operationLoading, setOperationLoading] = useState(true);
  const [operationSearchTerm, setOperationSearchTerm] = useState("");
  const [operationStatusFilter, setOperationStatusFilter] = useState<string>("ALL");
  const [operationCampaignFilter, setOperationCampaignFilter] = useState<string>("ALL");
  const [operationSortBy, setOperationSortBy] = useState<OperationRequestSortOrder>("STATUS_PENDING_FIRST");
  const [operationStats, setOperationStats] = useState<OperationRequestStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedOperationRequest, setSelectedOperationRequest] = useState<OperationRequest | null>(null);
  const [isOperationUpdateDialogOpen, setIsOperationUpdateDialogOpen] = useState(false);
  const [isOperationDisbursementDialogOpen, setIsOperationDisbursementDialogOpen] = useState(false);
  const [selectedOperationForDisbursement, setSelectedOperationForDisbursement] =
    useState<OperationRequest | null>(null);

  // Ingredient requests state
  const [ingredientRequests, setIngredientRequests] = useState<IngredientRequest[]>([]);
  const [ingredientStats, setIngredientStats] = useState<IngredientRequestStats | null>(null);
  const [ingredientLoading, setIngredientLoading] = useState(true);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState("");
  const [ingredientStatusFilter, setIngredientStatusFilter] = useState<string>("ALL");
  const [ingredientCampaignFilter, setIngredientCampaignFilter] = useState<string>("ALL");
  const [ingredientSortBy, setIngredientSortBy] = useState<string>("STATUS_PENDING_FIRST");
  const [selectedIngredientRequestId, setSelectedIngredientRequestId] = useState<string | null>(null);
  const [isIngredientDisbursementDialogOpen, setIsIngredientDisbursementDialogOpen] = useState(false);
  const [selectedIngredientForDisbursement, setSelectedIngredientForDisbursement] =
    useState<IngredientRequest | null>(null);

  // Disbursement detail state
  const [selectedDisbursementId, setSelectedDisbursementId] = useState<string | null>(null);

  // Request detail state (for non-disbursed requests)
  const [selectedRequestDetailId, setSelectedRequestDetailId] = useState<string | null>(null);
  const [selectedRequestDetailType, setSelectedRequestDetailType] = useState<"operation" | "ingredient">("operation");

  const fetchOperationData = useCallback(async () => {
    if (activeTab === "ingredient") return;

    setOperationLoading(true);
    try {
      const expenseType = activeTab === "cooking" ? "COOKING" : "DELIVERY";
      const [requestsData, statsData] = await Promise.all([
        operationRequestService.getOperationRequests({
          status: operationStatusFilter === "ALL" ? null : operationStatusFilter,
          expenseType: expenseType,
          campaignId: operationCampaignFilter === "ALL" ? null : operationCampaignFilter,
          sortBy: operationSortBy,
          limit: 100,
          offset: 0,
        }),
        operationRequestService.getOperationRequestStats()
      ]);
      setOperationRequests(requestsData);
      setOperationStats(statsData);
    } catch (error) {
      console.error("Error fetching operation data:", error);
    } finally {
      setOperationLoading(false);
    }
  }, [activeTab, operationStatusFilter, operationCampaignFilter, operationSortBy]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns({ limit: 100 });
        setCampaigns(data || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  const fetchIngredientData = useCallback(async () => {
    setIngredientLoading(true);
    try {
      const [requestsData, statsData] = await Promise.all([
        ingredientRequestService.getIngredientRequests({
          filter: {
            status: ingredientStatusFilter === "ALL" ? null : (ingredientStatusFilter as "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED"),
            campaignId: ingredientCampaignFilter === "ALL" ? null : ingredientCampaignFilter,
            sortBy: ingredientSortBy,
          },
          limit: 100,
          offset: 0,
        }),
        ingredientRequestService.getIngredientRequestStats(),
      ]);
      setIngredientRequests(requestsData);
      setIngredientStats(statsData);
    } catch (error) {
      console.error("Error fetching ingredient data:", error);
    } finally {
      setIngredientLoading(false);
    }
  }, [ingredientStatusFilter, ingredientCampaignFilter, ingredientSortBy]);

  useEffect(() => {
    if (activeTab === "ingredient") {
      fetchIngredientData();
    } else {
      fetchOperationData();
    }
  }, [activeTab, fetchOperationData, fetchIngredientData]);

  const getClientSideStats = (requests: OperationRequest[]): OperationRequestStats => {
    return {
      totalRequests: requests.length,
      pendingCount: requests.filter((r) => r.status === "PENDING").length,
      approvedCount: requests.filter((r) => r.status === "APPROVED").length,
      rejectedCount: requests.filter((r) => r.status === "REJECTED").length,
      disbursedCount: requests.filter((r) => r.status === "DISBURSED").length,
    };
  };

  // Use server stats if available, otherwise fallback to clientside (for immediate feedback or if stats API is not specific to tab)
  // Actually the server stats for operations might be global across tabs, but the list is filtered.
  // However, the user specifically asked for operationRequestStats.
  const displayOperationStats = operationStats || getClientSideStats(operationRequests);

  const filteredOperationRequests = operationRequests.filter((request) => {
    const searchLower = operationSearchTerm.toLowerCase();
    return (
      request.title.toLowerCase().includes(searchLower) ||
      request.user.full_name.toLowerCase().includes(searchLower) ||
      (request.campaignPhase?.campaign?.title || "").toLowerCase().includes(searchLower)
    );
  });

  const filteredIngredientRequests = ingredientRequests.filter((request) => {
    const searchLower = ingredientSearchTerm.toLowerCase();
    return (
      (request.campaignPhase?.phaseName || "").toLowerCase().includes(searchLower) ||
      (request.kitchenStaff?.full_name || "").toLowerCase().includes(searchLower)
    );
  });

  const handleOperationUpdateClick = (request: OperationRequest) => {
    setSelectedOperationRequest(request);
    setIsOperationUpdateDialogOpen(true);
  };

  const handleOperationUpdateSuccess = () => {
    fetchOperationData();
    setIsOperationUpdateDialogOpen(false);
    setSelectedOperationRequest(null);
  };

  const handleOperationDisbursementClick = (request: OperationRequest) => {
    setSelectedOperationForDisbursement(request);
    setIsOperationDisbursementDialogOpen(true);
  };

  const handleOperationDisbursementSuccess = () => {
    fetchOperationData();
    setIsOperationDisbursementDialogOpen(false);
    setSelectedOperationForDisbursement(null);
  };

  const handleIngredientDisbursementClick = (request: IngredientRequest) => {
    setSelectedIngredientForDisbursement(request);
    setIsIngredientDisbursementDialogOpen(true);
  };

  const handleIngredientDisbursementSuccess = () => {
    fetchIngredientData();
    setIsIngredientDisbursementDialogOpen(false);
    setSelectedIngredientForDisbursement(null);
  };

  const handleIngredientRequestUpdated = () => {
    fetchIngredientData();
  };

  const handleViewDisbursementDetail = async (requestId: string, requestType: "operation" | "ingredient") => {
    try {
      const inflowId = await disbursementService.getInflowIdByRequestId(requestId, requestType);
      if (inflowId) {
        setSelectedDisbursementId(inflowId);
      } else {
        toast.error("Không tìm thấy thông tin giải ngân");
      }
    } catch {
      toast.error("Có lỗi khi tải thông tin giải ngân");
    }
  };

  const renderStatsCards = (stats: { totalRequests: number; pendingCount: number; approvedCount: number; rejectedCount: number; disbursedCount: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng yêu cầu</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRequests}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Chờ duyệt</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingCount}</p>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Đã duyệt</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.approvedCount}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Từ chối</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejectedCount}</p>
          </div>
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Đã giải ngân</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.disbursedCount}</p>
          </div>
          <Send className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý giải ngân</h1>
          <p className="text-gray-600 mt-1">
            Duyệt và quản lý các yêu cầu giải ngân theo danh mục
          </p>
        </div>
        <Button
          onClick={() => activeTab === "ingredient" ? fetchIngredientData() : fetchOperationData()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-gray-100/50 dark:bg-slate-800/50 rounded-2xl gap-2 mb-8 border border-gray-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("ingredient")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 font-semibold transition-all rounded-xl ${activeTab === "ingredient"
            ? "bg-white text-[#E77731] shadow-md scale-[1.02]"
            : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
            }`}
        >
          <ShoppingCart className="h-5 w-5" />
          Chi phí mua nguyên liệu
        </button>
        <button
          onClick={() => setActiveTab("cooking")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 font-semibold transition-all rounded-xl ${activeTab === "cooking"
            ? "bg-white text-[#E77731] shadow-md scale-[1.02]"
            : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
            }`}
        >
          <Utensils className="h-5 w-5" />
          Chi phí nấu ăn
        </button>
        <button
          onClick={() => setActiveTab("delivery")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 font-semibold transition-all rounded-xl ${activeTab === "delivery"
            ? "bg-white text-[#E77731] shadow-md scale-[1.02]"
            : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
            }`}
        >
          <Truck className="h-5 w-5" />
          Chi phí vận chuyển
        </button>
      </div>

      {/* Stats Cards */}
      {activeTab === "ingredient" && ingredientStats && renderStatsCards(ingredientStats)}
      {activeTab !== "ingredient" && renderStatsCards(displayOperationStats)}

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={activeTab === "ingredient" ? "Tìm kiếm theo giai đoạn, người gửi..." : "Tìm kiếm theo tiêu đề, người tạo, chiến dịch..."}
              value={activeTab === "ingredient" ? ingredientSearchTerm : operationSearchTerm}
              onChange={(e) => activeTab === "ingredient" ? setIngredientSearchTerm(e.target.value) : setOperationSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={activeTab === "ingredient" ? ingredientStatusFilter : operationStatusFilter}
            onValueChange={(val) => activeTab === "ingredient" ? setIngredientStatusFilter(val) : setOperationStatusFilter(val)}
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
              {activeTab !== "ingredient" && <SelectItem value="DISBURSED">Đã giải ngân</SelectItem>}
            </SelectContent>
          </Select>

          {activeTab === "ingredient" ? (
            <>
              <Select
                value={ingredientCampaignFilter}
                onValueChange={(val) => setIngredientCampaignFilter(val)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Chọn chiến dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả chiến dịch</SelectItem>
                  {campaigns.map((campaign: Campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={ingredientSortBy}
                onValueChange={(val) => setIngredientSortBy(val)}
              >
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STATUS_PENDING_FIRST">Chờ duyệt</SelectItem>
                  <SelectItem value="NEWEST_FIRST">Mới nhất</SelectItem>
                  <SelectItem value="OLDEST_FIRST">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <Select
                value={operationCampaignFilter}
                onValueChange={(val) => setOperationCampaignFilter(val)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Chọn chiến dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả chiến dịch</SelectItem>
                  {campaigns.map((campaign: Campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={operationSortBy}
                onValueChange={(val) => setOperationSortBy(val as OperationRequestSortOrder)}
              >
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STATUS_PENDING_FIRST">Chờ duyệt</SelectItem>
                  <SelectItem value="NEWEST_FIRST">Mới nhất</SelectItem>
                  <SelectItem value="OLDEST_FIRST">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>

      {/* Data Lists */}
      <div className="bg-white rounded-lg border shadow-sm">
        {/* Ingredient List */}
        {activeTab === "ingredient" && (
          ingredientLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader animate loop className="h-8 w-8 text-color" />
            </div>
          ) : filteredIngredientRequests.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">Không tìm thấy yêu cầu nguyên liệu nào</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredIngredientRequests.map((request) => {
                const status = statusLabels[request.status] || {
                  label: request.status,
                  color: "bg-gray-100 text-gray-800",
                  icon: Package,
                };
                const StatusIcon = status.icon;

                return (
                  <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.campaignPhase?.phaseName || "Chưa có giai đoạn"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {request.kitchenStaff?.full_name}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Loại: Nguyên liệu
                          </Badge>
                          {request.campaignPhase?.campaign && (
                            <Link
                              href={`/admin/campaigns/${createCampaignSlug(
                                request.campaignPhase?.campaign?.title || "",
                                request.campaignPhase?.campaign?.id || ""
                              )}`}
                              target="_blank"
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium"
                            >
                              • {request.campaignPhase.campaign.title}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                      <Badge className={`${status.color} border-0 gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(request.totalCost)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>{request?.kitchenStaff?.full_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span>{formatDateTime(new Date(request.created_at))}</span>
                      </div>

                      <div className="flex justify-end gap-2">
                        {request.status === "DISBURSED" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDisbursementDetail(request.id, "ingredient")}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Xem giải ngân
                          </Button>
                        ) : request.status === "REJECTED" ? null : request.status === "APPROVED" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequestDetailId(request.id);
                                setSelectedRequestDetailType("ingredient");
                              }}
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleIngredientDisbursementClick(request)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Giải ngân
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedIngredientRequestId(request.id)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Xem & Duyệt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Cooking & Delivery List */}
        {activeTab !== "ingredient" && (
          operationLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader animate loop className="h-8 w-8 text-color" />
            </div>
          ) : filteredOperationRequests.length === 0 ? (
            <div className="text-center py-12">
              {activeTab === "cooking" ? (
                <Utensils className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              ) : (
                <Truck className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              )}
              <p className="text-gray-500 font-medium">Không tìm thấy yêu cầu nào</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredOperationRequests.map((request) => {
                const status = statusLabels[request.status] || {
                  label: request.status,
                  color: "bg-gray-100 text-gray-800",
                  icon: Package,
                };
                const StatusIcon = status.icon;

                return (
                  <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {request.campaignPhase?.phaseName || "Chưa có giai đoạn"}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Loại: {activeTab === "cooking" ? "Nấu ăn" : "Vận chuyển"}
                          </Badge>
                          {request.campaignPhase?.campaign && (
                            <Link
                              href={`/admin/campaigns/${createCampaignSlug(
                                request.campaignPhase?.campaign?.title || "",
                                request.campaignPhase?.campaign?.id || ""
                              )}`}
                              target="_blank"
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium"
                            >
                              • {request.campaignPhase.campaign.title}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                      <Badge className={`${status.color} border-0 gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(parseFloat(request.totalCost))}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>{request?.user?.full_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span>{formatDateTime(new Date(request.created_at))}</span>
                      </div>

                      <div className="flex justify-end gap-2">
                        {request.status === "DISBURSED" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDisbursementDetail(request.id, "operation")}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Xem giải ngân
                          </Button>
                        ) : request.status === "REJECTED" ? null : request.status === "APPROVED" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequestDetailId(request.id);
                                setSelectedRequestDetailType("operation");
                              }}
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleOperationDisbursementClick(request)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Giải ngân
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequestDetailId(request.id);
                                setSelectedRequestDetailType("operation");
                              }}
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleOperationUpdateClick(request)}
                              className="btn-color"
                            >
                              Xử lý
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Operation Update Dialog */}
      {selectedOperationRequest && (
        <UpdateOperationRequestDialog
          isOpen={isOperationUpdateDialogOpen}
          onClose={() => {
            setIsOperationUpdateDialogOpen(false);
            setSelectedOperationRequest(null);
          }}
          request={selectedOperationRequest}
          onSuccess={handleOperationUpdateSuccess}
        />
      )}

      {/* Operation Disbursement Dialog */}
      {selectedOperationForDisbursement && (
        <CreateDisbursementDialog
          isOpen={isOperationDisbursementDialogOpen}
          onClose={() => {
            setIsOperationDisbursementDialogOpen(false);
            setSelectedOperationForDisbursement(null);
          }}
          requestId={selectedOperationForDisbursement.id}
          requestType="operation"
          amount={String(selectedOperationForDisbursement.totalCost)}
          campaignPhaseId={selectedOperationForDisbursement.campaignPhase?.id}
          onSuccess={handleOperationDisbursementSuccess}
        />
      )}

      {/* Ingredient Detail Dialog */}
      {selectedIngredientRequestId && (
        <AdminIngredientRequestDetailDialog
          isOpen={!!selectedIngredientRequestId}
          onClose={() => setSelectedIngredientRequestId(null)}
          requestId={selectedIngredientRequestId}
          onUpdated={handleIngredientRequestUpdated}
        />
      )}

      {/* Ingredient Disbursement Dialog */}
      {selectedIngredientForDisbursement && (
        <CreateDisbursementDialog
          isOpen={isIngredientDisbursementDialogOpen}
          onClose={() => {
            setIsIngredientDisbursementDialogOpen(false);
            setSelectedIngredientForDisbursement(null);
          }}
          requestId={selectedIngredientForDisbursement.id}
          requestType="ingredient"
          amount={String(selectedIngredientForDisbursement.totalCost)}
          campaignPhaseId={selectedIngredientForDisbursement.campaignPhase?.id}
          onSuccess={handleIngredientDisbursementSuccess}
        />
      )}

      {/* Disbursement Detail Dialog */}
      {selectedDisbursementId && (
        <DisbursementDetailDialog
          isOpen={!!selectedDisbursementId}
          onClose={() => setSelectedDisbursementId(null)}
          disbursementId={selectedDisbursementId}
        />
      )}

      {/* Request Detail Dialog (for non-disbursed requests) */}
      {selectedRequestDetailId && (
        <RequestDetailDialog
          isOpen={!!selectedRequestDetailId}
          onClose={() => setSelectedRequestDetailId(null)}
          requestId={selectedRequestDetailId}
          requestType={selectedRequestDetailType}
        />
      )}
    </div>
  );
}
