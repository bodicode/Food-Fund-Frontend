"use client";

import { useEffect, useState } from "react";
import { operationRequestService } from "@/services/operation-request.service";
import { ingredientRequestService } from "@/services/ingredient-request.service";
import { OperationRequest } from "@/types/api/operation-request";
import { IngredientRequest } from "@/types/api/ingredient-request";
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
  DollarSign,
  Package,
  Clock,
  FileText,
} from "lucide-react";

interface RequestDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  requestType: "operation" | "ingredient";
}

export function RequestDetailDialog({
  isOpen,
  onClose,
  requestId,
  requestType,
}: RequestDetailDialogProps) {
  const [operationRequest, setOperationRequest] = useState<OperationRequest | null>(null);
  const [ingredientRequest, setIngredientRequest] = useState<IngredientRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      if (isOpen && requestId) {
        setLoading(true);
        try {
          if (requestType === "operation") {
            const data = await operationRequestService.getOperationRequestById(requestId);
            setOperationRequest(data);
          } else {
            const data = await ingredientRequestService.getIngredientRequest(requestId);
            setIngredientRequest(data);
          }
        } catch (error) {
          console.error("Error fetching request details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDetails();
  }, [isOpen, requestId, requestType]);

  const request = requestType === "operation" ? operationRequest : ingredientRequest;
  const organization = request?.organization as { 
    id: string;
    name: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_name: string;
    bank_short_name: string;
  } | undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] w-[90vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Chi tiết yêu cầu {requestType === "operation" ? "giải ngân" : "nguyên liệu"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader animate loop className="h-8 w-8 text-color" />
          </div>
        ) : !request ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy thông tin yêu cầu</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Amount & Status */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Số tiền yêu cầu</p>
                  <p className="text-3xl font-bold text-[#E77731]">
                    {formatCurrency(typeof request.totalCost === 'string' ? parseFloat(request.totalCost) : request.totalCost)}
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 border-0 gap-2 px-4 py-2">
                  <Clock className="h-4 w-4" />
                  {request.status}
                </Badge>
              </div>

              {requestType === "operation" && operationRequest && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Tiêu đề</p>
                    <p className="font-semibold text-gray-900">{operationRequest.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Loại chi phí</p>
                    <p className="font-semibold text-gray-900">
                      {operationRequest.expenseType === "COOKING" ? "Nấu ăn" : "Vận chuyển"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Requester Info */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Thông tin người yêu cầu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ và tên</p>
                  <p className="font-semibold text-gray-900">
                    {requestType === "operation" 
                      ? operationRequest?.user?.full_name 
                      : ingredientRequest?.kitchenStaff?.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Giai đoạn</p>
                  <p className="font-semibold text-gray-900">
                    {request.campaignPhase?.phaseName}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Info - IMPORTANT */}
            {organization ? (
              <div className="border-4 border-green-500 rounded-lg p-6 bg-green-50/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  ⭐ Thông tin ngân hàng để chuyển khoản
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm font-bold">
                          {organization.bank_short_name}
                        </Badge>
                        <p className="text-sm text-gray-700">
                          {organization.bank_name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Số tài khoản</p>
                      <p className="text-2xl font-mono font-bold text-gray-900 bg-white px-4 py-3 rounded border-2 border-green-500">
                        {organization.bank_account_number}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tên tài khoản</p>
                    <p className="font-semibold text-gray-900 text-xl bg-white px-4 py-3 rounded border">
                      {organization.bank_account_name}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-gray-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        {organization.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-4 border-yellow-500 rounded-lg p-6 bg-yellow-50/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-yellow-600" />
                  ⚠️ Thông tin ngân hàng
                </h3>
                <p className="text-gray-700">
                  Yêu cầu này chưa có thông tin tổ chức/ngân hàng. Vui lòng liên hệ người yêu cầu để cập nhật thông tin trước khi giải ngân.
                </p>
              </div>
            )}

            {/* Ingredient Items */}
            {requestType === "ingredient" && ingredientRequest?.items && ingredientRequest.items.length > 0 && (
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Danh sách nguyên liệu ({ingredientRequest.items.length})
                </h3>
                <div className="space-y-3">
                  {ingredientRequest.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-900">{item.ingredientName}</p>
                        <p className="text-lg font-bold text-[#E77731]">
                          {formatCurrency(item.estimatedTotalPrice)}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Số lượng:</span> {item.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Đơn giá:</span> {formatCurrency(item.estimatedUnitPrice)}
                        </div>
                        <div>
                          <span className="font-medium">Nhà cung cấp:</span> {item.supplier || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Note */}
            {requestType === "operation" && operationRequest?.adminNote && (
              <div className="border rounded-lg p-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Ghi chú của Admin
                </h3>
                <p className="text-gray-700">{operationRequest.adminNote}</p>
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
                    {formatDateTime(request.created_at)}
                  </span>
                </div>
                {request.changedStatusAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Thay đổi trạng thái</span>
                    <span className="font-semibold text-gray-900">
                      {formatDateTime(request.changedStatusAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Request ID */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-1">ID Yêu cầu</p>
              <p className="font-mono text-xs text-gray-900 break-all">{request.id}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
