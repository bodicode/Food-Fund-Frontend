"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { operationRequestService } from "@/services/operation-request.service";
import { OperationRequest, OperationRequestStats } from "@/types/api/operation-request";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
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
} from "lucide-react";
import { UpdateOperationRequestDialog } from "@/components/admin/update-operation-request-dialog";

const expenseTypeLabels: Record<OperationRequest["expenseType"], string> = {
  COOKING: "Nấu ăn",
  DELIVERY: "Vận chuyển",
  INGREDIENT: "Nguyen lieu",
};

const statusLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  APPROVED: { label: "Đã duyệt", color: "bg-green-100 text-green-800", icon: CheckCircle },
  REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function OperationRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<OperationRequest[]>([]);
  const [stats, setStats] = useState<OperationRequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedRequest, setSelectedRequest] = useState<OperationRequest | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsData, statsData] = await Promise.all([
        operationRequestService.getOperationRequests({
          status: statusFilter === "ALL" ? null : statusFilter,
          limit: 100,
          offset: 0,
        }),
        operationRequestService.getOperationRequestStats(),
      ]);
      setRequests(requestsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredRequests = requests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.title.toLowerCase().includes(searchLower) ||
      request.user.full_name.toLowerCase().includes(searchLower) ||
      request.campaignPhase.campaign?.title.toLowerCase().includes(searchLower)
    );
  });

  const handleUpdateClick = (request: OperationRequest) => {
    setSelectedRequest(request);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchData();
    setIsUpdateDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý giải ngân</h1>
          <p className="text-gray-600 mt-1">
            Duyệt và quản lý các yêu cầu giải ngân từ người gây quỹ
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng yêu cầu</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalRequests}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pendingCount}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.approvedCount}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Từ chối</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.rejectedCount}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tiêu đề, người tạo, chiến dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg border shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader animate loop className="h-8 w-8 text-color" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">Không tìm thấy yêu cầu nào</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredRequests.map((request) => {
              const status = statusLabels[request.status] || {
                label: request.status,
                color: "bg-gray-100 text-gray-800",
                icon: Package,
              };
              const StatusIcon = status.icon;

              return (
                <div
                  key={request.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {request.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {request.campaignPhase.phaseName}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {expenseTypeLabels[request.expenseType]}
                        </Badge>
                        {request.campaignPhase.campaign && (
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/campaigns/${request.campaignPhase.campaign?.id}`
                              )
                            }
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium"
                          >
                            • {request.campaignPhase.campaign.title}
                            <ExternalLink className="h-3 w-3" />
                          </button>
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
                      <span>{request.user.full_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span>{formatDateTime(request.created_at)}</span>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateClick(request)}
                        className="btn-color"
                      >
                        Xử lý
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Dialog */}
      {selectedRequest && (
        <UpdateOperationRequestDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => {
            setIsUpdateDialogOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
