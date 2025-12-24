"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { operationRequestService } from "@/services/operation-request.service";
import { ingredientRequestService } from "@/services/ingredient-request.service";
import { OperationRequest } from "@/types/api/operation-request";
import { IngredientRequest } from "@/types/api/ingredient-request";
import { Loader } from "@/components/animate-ui/icons/loader";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { createCampaignSlug } from "@/lib/utils/slug-utils";
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
  Package,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Send,
  DollarSign,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RequestDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  requestType: "operation" | "ingredient";
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  APPROVED: {
    label: "Đã duyệt",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Từ chối",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  DISBURSED: {
    label: "Đã giải ngân",
    color: "bg-blue-100 text-blue-800",
    icon: Send,
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
};

const expenseTypeLabels = {
  INGREDIENT: "Nguyên liệu",
  COOKING: "Nấu ăn",
  DELIVERY: "Vận chuyển",
};

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

  // ✅ Ngăn scroll body khi dialog mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const request = requestType === "operation" ? operationRequest : ingredientRequest;
  const organization = request?.organization as {
    id: string;
    name: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_name: string;
    bank_short_name: string;
  } | undefined;

  const totalCost = requestType === "operation" && operationRequest
    ? parseFloat(operationRequest.totalCost)
    : ingredientRequest?.totalCost;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!min-w-[98vw] !w-[98vw]  h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        onWheel={(e) => e.stopPropagation()}
      >
        <DialogHeader className="flex-shrink-0 px-8 pt-8 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">
            Chi tiết yêu cầu {requestType === "operation" ? "giải ngân" : "nguyên liệu"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
            </div>
          ) : !request ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy thông tin yêu cầu</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">Trạng thái</div>
                {statusConfig[request.status] ? (
                  <Badge
                    className={`${statusConfig[request.status].color
                      } flex items-center gap-1`}
                  >
                    {(() => {
                      const StatusIcon = statusConfig[request.status].icon;
                      return <StatusIcon className="w-4 h-4" />;
                    })()}
                    {statusConfig[request.status].label}
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">
                    {request.status}
                  </Badge>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campaign Card */}
                {request.campaignPhase?.campaign && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 md:col-span-2">
                    <DollarSign className="w-5 h-5 text-[#ad4e28] dark:text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Chiến dịch</div>
                      <Link
                        href={
                          request.campaignPhase?.campaign?.title && request.campaignPhase?.campaign?.id
                            ? `/admin/campaigns/${createCampaignSlug(
                              request.campaignPhase.campaign.title || "",
                              request.campaignPhase.campaign.id || ""
                            )}`
                            : "#"
                        }
                        target="_blank"
                        className="font-bold text-[#ad4e28] dark:text-orange-500 mt-1 text-lg hover:underline flex items-center gap-2 group"
                      >
                        {request.campaignPhase?.campaign?.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Sender Card */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <User className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Người gửi</div>
                    <div className="font-bold text-gray-900 dark:text-white mt-1">
                      {requestType === "operation"
                        ? operationRequest?.user?.full_name
                        : ingredientRequest?.kitchenStaff?.full_name}
                    </div>
                  </div>
                </div>

                {/* Phase Card */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Package className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Giai đoạn</div>
                    <div className="font-bold text-gray-900 dark:text-white mt-1">
                      {request.campaignPhase?.phaseName || "Chưa có giai đoạn"}
                    </div>
                    {requestType === "operation" && operationRequest && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Loại: {expenseTypeLabels[operationRequest.expenseType] || operationRequest.expenseType}
                      </div>
                    )}
                    {requestType === "ingredient" && ingredientRequest?.campaignPhase?.cookingDate && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Ngày nấu: {formatDateTime(ingredientRequest.campaignPhase.cookingDate)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Created Date Card */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ngày tạo</div>
                    <div className="font-bold text-gray-900 dark:text-white mt-1">
                      {formatDateTime(new Date(request.created_at))}
                    </div>
                  </div>
                </div>

                {/* Changed Status Date Card */}
                {request.changedStatusAt && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Clock className="w-5 h-5 text-gray-700 dark:text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Ngày thay đổi trạng thái
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white mt-1">
                        {formatDateTime(new Date(request.changedStatusAt))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bank Info */}
              {organization ? (
                <div className="border-4 border-green-500 rounded-lg p-6 bg-green-50/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Thông tin ngân hàng để chuyển khoản
                  </h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-sm font-bold">
                              {organization.bank_short_name}
                            </Badge>
                            <p className="text-sm text-gray-700 mb-0">
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

                      <div className="pt-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-600" />
                          <p className="text-sm font-semibold text-gray-900">
                            {organization.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 min-w-[200px]">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mã QR Chuyển khoản</div>
                      <div className="relative w-40 h-40">
                        <Image
                          src={`https://img.vietqr.io/image/${organization.bank_short_name}-${organization.bank_account_number}-compact2.png?amount=${totalCost}&addInfo=Giai ngan yeu cau ${request.id.slice(0, 8)}&accountName=${encodeURIComponent(organization.bank_account_name)}`}
                          alt="VietQR Transfer"
                          width={160}
                          height={160}
                          unoptimized
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="mt-2 text-[10px] text-gray-400 font-medium">VietQR Service</div>
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
                    Yêu cầu này chưa có thông tin tổ chức/ngân hàng.
                  </p>
                </div>
              )}

              {/* Total Cost */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng chi phí yêu cầu</div>
                <div className="text-3xl font-bold text-[#ad4e28] dark:text-orange-500">
                  {formatCurrency(totalCost || 0)}
                </div>
              </div>

              {/* Ingredient Items Table */}
              {requestType === "ingredient" && ingredientRequest?.items && ingredientRequest.items.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-400" />
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      Danh sách nguyên liệu ({ingredientRequest.items.length})
                    </h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100 dark:bg-gray-800">
                            <TableHead className="min-w-[200px] font-bold text-gray-900 dark:text-white">
                              Tên nguyên liệu
                            </TableHead>
                            <TableHead className="text-right min-w-[120px] font-bold text-gray-900 dark:text-white">
                              Số lượng
                            </TableHead>
                            <TableHead className="text-right min-w-[140px] font-bold text-gray-900 dark:text-white">
                              Đơn giá
                            </TableHead>
                            <TableHead className="text-right min-w-[160px] font-bold text-gray-900 dark:text-white">
                              Thành tiền
                            </TableHead>
                            <TableHead className="min-w-[180px] font-bold text-gray-900 dark:text-white">
                              Nhà cung cấp
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ingredientRequest.items.map((item, index) => (
                            <TableRow
                              key={item.id}
                              className={
                                index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-800"
                              }
                            >
                              <TableCell className="font-semibold text-gray-900 dark:text-white">
                                {item.ingredientName}
                              </TableCell>
                              <TableCell className="text-right text-gray-900 dark:text-white">
                                <span className="font-bold">
                                  {item.quantity} {item.unit}
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-gray-800 dark:text-gray-300">
                                {formatCurrency(item.estimatedUnitPrice)}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="font-bold text-[#ad4e28] dark:text-orange-500">
                                  {formatCurrency(item.estimatedTotalPrice)}
                                </span>
                              </TableCell>
                              <TableCell className="text-gray-700 dark:text-gray-400">
                                {item.supplier || "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Note */}
              {((requestType === "operation" && operationRequest?.adminNote) ||
                (requestType === "ingredient" && ingredientRequest?.adminNote)) && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Ghi chú của quản trị viên
                    </h4>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {requestType === "operation" ? operationRequest?.adminNote : ingredientRequest?.adminNote}
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
