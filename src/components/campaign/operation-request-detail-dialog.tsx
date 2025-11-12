"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { operationRequestService } from "@/services/operation-request.service";
import { OperationRequest } from "@/types/api/operation-request";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Calendar,
  User,
  Package,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";

interface OperationRequestDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
}

const expenseTypeLabels = {
  COOKING: "Nấu ăn",
  DELIVERY: "Vận chuyển",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-800" },
  COMPLETED: { label: "Hoàn thành", color: "bg-blue-100 text-blue-800" },
};

export function OperationRequestDetailDialog({
  isOpen,
  onClose,
  requestId,
}: OperationRequestDetailDialogProps) {
  const [request, setRequest] = useState<OperationRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !requestId) return;

    const fetchRequest = async () => {
      setLoading(true);
      try {
        const data = await operationRequestService.getOperationRequestById(requestId);
        setRequest(data);
      } catch (error) {
        console.error("Error fetching operation request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [isOpen, requestId]);

  const status = request
    ? statusLabels[request.status] || {
        label: request.status,
        color: "bg-gray-100 text-gray-800",
      }
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu giải ngân</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về yêu cầu giải ngân
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader animate loop className="h-8 w-8 text-color" />
          </div>
        ) : !request ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">Không tìm thấy yêu cầu giải ngân</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {request.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {request.campaignPhase.phaseName}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {expenseTypeLabels[request.expenseType]}
                  </Badge>
                </div>
              </div>
              {status && (
                <Badge className={`${status.color} border-0`}>
                  {status.label}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Tổng chi phí</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(parseFloat(request.totalCost))}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Người tạo</p>
                  <p className="font-medium text-gray-900">
                    {request.user.full_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Giai đoạn</p>
                  <p className="font-medium text-gray-900">
                    {request.campaignPhase.phaseName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(request.created_at)}
                  </p>
                </div>
              </div>

              {request.changedStatusAt && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      Thời gian thay đổi trạng thái
                    </p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(request.changedStatusAt)}
                    </p>
                  </div>
                </div>
              )}

              {request.adminNote && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Ghi chú từ Admin
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {request.adminNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
