"use client";

import { useEffect, useState } from "react";
import { operationRequestService } from "@/services/operation-request.service";
import { OperationRequest } from "@/types/api/operation-request";
import { Loader } from "@/components/animate-ui/icons/loader";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, User, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OperationRequestDetailDialog } from "./operation-request-detail-dialog";

interface OperationRequestListProps {
  campaignId: string;
  campaignPhaseId?: string;
  refreshKey?: number;
}

const expenseTypeLabels: Record<OperationRequest["expenseType"], string> = {
  COOKING: "Nấu ăn",
  DELIVERY: "Vận chuyển",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-800" },
  COMPLETED: { label: "Hoàn thành", color: "bg-blue-100 text-blue-800" },
  DISBURSED: { label: "Đã giải ngân", color: "bg-blue-100 text-blue-800" }
};

export function OperationRequestList({ campaignId, campaignPhaseId, refreshKey }: OperationRequestListProps) {
  const [requests, setRequests] = useState<OperationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await operationRequestService.getOperationRequests({
          campaignId,
          campaignPhaseId,
          limit: 100,
          offset: 0,
        });
        setRequests(data);
      } catch (error) {
        console.error("Error fetching operation requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [campaignId, campaignPhaseId, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader animate loop className="h-8 w-8 text-color" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-500 font-medium">Chưa có yêu cầu giải ngân nào</p>
        <p className="text-sm text-gray-400 mt-1">
          Tạo yêu cầu giải ngân để quản lý chi phí chiến dịch
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((request) => {
          const status = statusLabels[request.status] || {
            label: request.status,
            color: "bg-gray-100 text-gray-800",
          };

          return (
            <div
              key={request.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{request.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline" className="text-xs">
                      {request.campaignPhase.phaseName}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {expenseTypeLabels[request.expenseType]}
                    </Badge>
                  </div>
                </div>
                <Badge className={`${status.color} border-0`}>{status.label}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
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
                  <span>{formatDateTime(request.created_at)}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequestId(request.id)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Xem chi tiết
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Dialog */}
      {selectedRequestId && (
        <OperationRequestDetailDialog
          isOpen={!!selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          requestId={selectedRequestId}
        />
      )}
    </>
  );
}
