"use client";

import { useEffect, useState } from "react";
import { disbursementService, Disbursement, TransactionType } from "@/services/disbursement.service";
import { Loader } from "@/components/animate-ui/icons/loader";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CreditCard,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
} from "lucide-react";

interface DisbursementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  disbursementId: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Chờ người nhận xác nhận", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-800", icon: CheckCircle },
  FAILED: { label: "Thất bại", color: "bg-red-100 text-red-800", icon: XCircle },
};

export function DisbursementDetailDialog({
  isOpen,
  onClose,
  disbursementId,
}: DisbursementDetailDialogProps) {
  const [disbursement, setDisbursement] = useState<Disbursement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      if (isOpen && disbursementId) {
        setLoading(true);
        try {
          const data = await disbursementService.getInflowTransactionDetails(disbursementId);
          setDisbursement(data);
        } catch (error) {
          console.error("Error fetching disbursement details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDetails();
  }, [isOpen, disbursementId]);

  const transactionTypeLabels: Record<TransactionType, string> = {
    INGREDIENT: "Nguyên liệu",
    COOKING: "Nấu ăn",
    DELIVERY: "Vận chuyển",
  };

  const status = disbursement ? statusConfig[disbursement.status] : null;
  const StatusIcon = status?.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] w-[90vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Chi tiết giải ngân
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader animate loop className="h-8 w-8 text-color" />
          </div>
        ) : !disbursement ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy thông tin giải ngân</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status & Amount */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Số tiền giải ngân</p>
                  <p className="text-3xl font-bold text-[#E77731]">
                    {formatCurrency(parseFloat(disbursement.amount))}
                  </p>
                </div>
                {status && StatusIcon && (
                  <Badge className={`${status.color} border-0 gap-2 px-4 py-2`}>
                    <StatusIcon className="h-4 w-4" />
                    {status.label}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Giai đoạn</p>
                  <p className="font-semibold text-gray-900">
                    {disbursement.campaignPhase?.phaseName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Loại giao dịch</p>
                  <p className="font-semibold text-gray-900">
                    {transactionTypeLabels[disbursement.transactionType]}
                  </p>
                </div>
              </div>
            </div>

            {/* Receiver Info */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Thông tin người nhận
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ và tên</p>
                  <p className="font-semibold text-gray-900">
                    {disbursement.receiver.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tên đăng nhập</p>
                  <p className="font-semibold text-gray-900">
                    @{disbursement.receiver.user_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vai trò</p>
                  <Badge variant="outline">{disbursement.receiver.role}</Badge>
                </div>
              </div>
            </div>

            {/* Bank Info */}
            {disbursement.organization && (
              <div className="border rounded-lg p-6 bg-blue-50/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Thông tin ngân hàng
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                          {disbursement.organization.bank_short_name}
                        </Badge>
                        <p className="text-sm text-gray-700">
                          {disbursement.organization.bank_name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Số tài khoản</p>
                      <p className="text-lg font-mono font-bold text-gray-900 bg-white px-3 py-2 rounded border">
                        {disbursement.organization.bank_account_number}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tên tài khoản</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {disbursement.organization.bank_account_name}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-gray-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        {disbursement.organization.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{disbursement.organization.representative_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{disbursement.organization.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Thời gian
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ngày tạo</span>
                  <span className="font-semibold text-gray-900">
                    {formatDateTime(disbursement.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cập nhật lần cuối</span>
                  <span className="font-semibold text-gray-900">
                    {formatDateTime(disbursement.updated_at)}
                  </span>
                </div>
                {disbursement.reportedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày báo cáo</span>
                    <span className="font-semibold text-gray-900">
                      {formatDateTime(disbursement.reportedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="border rounded-lg p-4">
                <p className="text-gray-600 mb-1">ID Giao dịch</p>
                <p className="font-mono text-xs text-gray-900 break-all">
                  {disbursement.id}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-gray-600 mb-1">Đã báo cáo</p>
                <Badge variant={disbursement.isReported ? "default" : "secondary"}>
                  {disbursement.isReported ? "Có" : "Chưa"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
