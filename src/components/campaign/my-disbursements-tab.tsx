"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { disbursementService, Disbursement, DisbursementStatus, TransactionType } from "@/services/disbursement.service";

import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { toast } from "sonner";
import { translateError } from "@/lib/translator";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Package,
  FileText,
  RefreshCw,
  X,
} from "lucide-react";

const statusConfig: Record<DisbursementStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  COMPLETED: {
    label: "Đã nhận",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  FAILED: {
    label: "Thất bại",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const transactionTypeLabels: Record<TransactionType, string> = {
  INGREDIENT: "Nguyên liệu",
  COOKING: "Nấu ăn",
  DELIVERY: "Vận chuyển",
};

interface DisbursementWithDetails extends Disbursement {
  campaignTitle?: string;
  phaseName?: string;
}

export function MyDisbursementsTab() {
  const [disbursements, setDisbursements] = useState<DisbursementWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string>("");

  const fetchDisbursements = async () => {
    setLoading(true);
    try {
      const result = await disbursementService.getMyDisbursements(100, 1);

      // Fetch additional details for each disbursement
      const disbursementsWithDetails = result.items.map((disbursement) => ({
        ...disbursement,
        campaignTitle: disbursement.campaignPhase?.campaign?.title || "N/A",
        phaseName: disbursement.campaignPhase?.phaseName || "N/A",
      }));

      setDisbursements(disbursementsWithDetails);
    } catch (error) {
      const errorMessage = translateError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursements();
  }, []);

  const handleConfirmDisbursement = async (
    disbursementId: string,
    status: "COMPLETED" | "FAILED"
  ) => {
    setConfirming(disbursementId);
    try {
      await disbursementService.confirmDisbursement({
        id: disbursementId,
        status,
      });
      toast.success(
        status === "COMPLETED"
          ? "Xác nhận đã nhận giải ngân thành công!"
          : "Xác nhận thất bại thành công!"
      );
      fetchDisbursements();
    } catch (error) {
      const errorMessage = translateError(error);
      toast.error(errorMessage);
    } finally {
      setConfirming(null);
    }
  };

  const openLightbox = (proofUrl: string) => {
    setSelectedProofUrl(`https://foodfund.sgp1.cdn.digitaloceanspaces.com/${proofUrl}`);
    setLightboxOpen(true);
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  const isPdf = (url: string) => /\.pdf$/i.test(url);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yêu cầu giải ngân của tôi</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDisbursements}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Disbursements List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-color" />
        </div>
      ) : disbursements.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không có yêu cầu giải ngân nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {disbursements.map((disbursement) => {
            const status = statusConfig[disbursement.status];
            const StatusIcon = status.icon;

            return (
              <Card key={disbursement.id} className="hover:shadow-lg transition-all border-l-4 border-l-[#ad4e28]">
                <CardContent className="p-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-5 pb-4 border-b">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {disbursement.campaignTitle}
                        </h3>
                        <Badge className={`${status.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Giai đoạn: <span className="font-medium text-gray-900">{disbursement.phaseName}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">Số tiền</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(parseFloat(disbursement.amount))}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Loại giao dịch</p>
                        <p className="font-semibold text-gray-900">
                          {transactionTypeLabels[disbursement.transactionType]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Ngày tạo</p>
                        <p className="font-semibold text-gray-900">
                          {formatDateTime(disbursement.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Hóa đơn</p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => openLightbox(disbursement.proof)}
                          className="font-semibold text-blue-600 hover:text-blue-700 p-0 h-auto"
                        >
                          Xem →
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {disbursement.status === "PENDING" && (
                    <div className="flex gap-3 justify-end pt-4 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleConfirmDisbursement(disbursement.id, "FAILED")
                        }
                        disabled={confirming === disbursement.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {confirming === disbursement.id ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Thất bại"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleConfirmDisbursement(disbursement.id, "COMPLETED")
                        }
                        disabled={confirming === disbursement.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {confirming === disbursement.id ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Đã nhận"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="!max-w-[98vw] !w-[98vw] !h-[98vh] p-0 bg-black/95 border-none" showCloseButton={false}>
          <DialogTitle className="sr-only">Chứng chỉ giải ngân</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content Display */}
            <div className="relative w-full h-full flex items-center justify-center p-12">
              {isImage(selectedProofUrl) ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedProofUrl}
                    alt="Chứng chỉ giải ngân"
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              ) : isPdf(selectedProofUrl) ? (
                <iframe
                  src={selectedProofUrl}
                  className="w-full h-full"
                  title="Chứng chỉ giải ngân"
                />
              ) : (
                <div className="text-white text-center">
                  <p className="mb-4">Không thể hiển thị file này</p>
                  <a
                    href={selectedProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Tải xuống file
                  </a>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
