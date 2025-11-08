"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { donationService } from "@/services/donation.service";
import { DonationPaymentDetail } from "@/types/api/donation";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { 
  Copy, 
  CheckCircle, 
  Clock, 
  XCircle,
  QrCode,
  Receipt
} from "lucide-react";
import { toast } from "sonner";

interface DonationDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
}

export function DonationDetailDialog({
  isOpen,
  onClose,
  orderCode,
}: DonationDetailDialogProps) {
  const [detail, setDetail] = useState<DonationPaymentDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderCode) {
      fetchDetail();
    }
  }, [isOpen, orderCode]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await donationService.getDonationPaymentLink(orderCode);
      setDetail(data);
    } catch (error) {
      console.error("Error fetching donation detail:", error);
      toast.error("Không thể tải thông tin chi tiết");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      SUCCESS: { 
        label: "Đã thanh toán", 
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle className="w-4 h-4" />
      },
      PENDING: { 
        label: "Chờ thanh toán", 
        color: "bg-yellow-100 text-yellow-700",
        icon: <Clock className="w-4 h-4" />
      },
      FAILED: { 
        label: "Thất bại", 
        color: "bg-red-100 text-red-700",
        icon: <XCircle className="w-4 h-4" />
      },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle>Chi tiết lệnh ủng hộ</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
            </div>
          ) : !detail ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy thông tin</p>
            </div>
          ) : (
            <>
              {/* Status & Amount */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Mã đơn hàng</div>
                    <div className="font-mono font-semibold text-lg">{detail.orderCode}</div>
                  </div>
                  <Badge className={`${getStatusInfo(detail.status).color} flex items-center gap-1`}>
                    {getStatusInfo(detail.status).icon}
                    {getStatusInfo(detail.status).label}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-orange-200">
                  <div>
                    <div className="text-xs text-gray-600">Tổng tiền</div>
                    <div className="font-bold text-lg text-gray-900">
                      {formatCurrency(detail.amount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Đã thanh toán</div>
                    <div className="font-bold text-lg text-green-600">
                      {formatCurrency(detail.amountPaid)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Còn lại</div>
                    <div className="font-bold text-lg text-orange-600">
                      {formatCurrency(detail.amountRemaining)}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code - Only show if pending */}
              {detail.status === "PENDING" && detail.qrCode && (
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Quét mã để thanh toán
                  </h3>
                  <div className="flex justify-center">
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
                      <QRCodeSVG value={detail.qrCode} size={200} level="M" />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Info - Only show if pending */}
              {detail.status === "PENDING" && detail.bankNumber && (
                <div className="bg-white rounded-xl border p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Thông tin chuyển khoản
                  </h3>

                  {detail.bankLogo && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Image
                        src={detail.bankLogo}
                        alt={detail.bankName || "Bank"}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <div>
                        <div className="font-semibold">{detail.bankFullName}</div>
                        <div className="text-sm text-gray-600">{detail.bankName}</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-500">Số tài khoản</div>
                        <div className="font-mono font-semibold">{detail.bankNumber}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(detail.bankNumber!, "số tài khoản")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-500">Tên tài khoản</div>
                        <div className="font-semibold">{detail.bankAccountName}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(detail.bankAccountName!, "tên tài khoản")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-500">Số tiền</div>
                        <div className="font-bold text-lg text-[#ad4e28]">
                          {formatCurrency(detail.amount)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(detail.amount.toString(), "số tiền")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {detail.description && (
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="text-xs text-gray-500">Nội dung chuyển khoản</div>
                          <div className="font-mono text-sm">{detail.description}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(detail.description!, "nội dung")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {detail.transactions && detail.transactions.length > 0 && (
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Lịch sử giao dịch ({detail.transactions.length})
                  </h3>
                  <div className="space-y-3">
                    {detail.transactions.map((tx, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-xs text-gray-500">Mã tham chiếu</div>
                            <div className="font-mono text-sm font-semibold">{tx.reference}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              {formatCurrency(tx.amount)}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>STK: {tx.accountNumber}</div>
                          <div>Nội dung: {tx.description}</div>
                          <div>Thời gian: {formatDateTime(tx.transactionDateTime)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="text-sm text-gray-500 text-center">
                Tạo lúc: {formatDateTime(detail.createdAt)}
              </div>
            </>
          )}
        </div>

        <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t">
          <Button onClick={onClose} className="w-full">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
