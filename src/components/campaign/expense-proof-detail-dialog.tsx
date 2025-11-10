"use client";

import React, { useEffect, useState } from "react";
import { expenseProofService } from "@/services/expense-proof.service";
import { ExpenseProof, ExpenseProofStatus } from "@/types/api/expense-proof";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, FileText, Calendar } from "lucide-react";
import Image from "next/image";

interface ExpenseProofDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expenseProofId: string;
}

const statusConfig: Record<
  ExpenseProofStatus,
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
};

export function ExpenseProofDetailDialog({
  isOpen,
  onClose,
  expenseProofId,
}: ExpenseProofDetailDialogProps) {
  const [expenseProof, setExpenseProof] = useState<ExpenseProof | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchExpenseProof = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseProofService.getExpenseProof(expenseProofId);
      setExpenseProof(data);
    } catch (error) {
      console.error("Error fetching expense proof:", error);
    } finally {
      setLoading(false);
    }
  }, [expenseProofId]);

  useEffect(() => {
    if (isOpen && expenseProofId) {
      fetchExpenseProof();
    }
  }, [isOpen, expenseProofId, fetchExpenseProof]);

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chi tiết chứng từ chi phí
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
            </div>
          ) : expenseProof ? (
            <div className="space-y-6">
              {/* Status & Request ID */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">Mã yêu cầu</div>
                    <div className="font-semibold text-gray-900">
                      {expenseProof.requestId}
                    </div>
                  </div>
                </div>
                <Badge
                  className={`${
                    statusConfig[expenseProof.status].color
                  } flex items-center gap-1`}
                >
                  {(() => {
                    const StatusIcon = statusConfig[expenseProof.status].icon;
                    return <StatusIcon className="w-4 h-4" />;
                  })()}
                  {statusConfig[expenseProof.status].label}
                </Badge>
              </div>

              {/* Amount */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                <div className="text-sm text-gray-600 mb-1">Số tiền</div>
                <div className="text-2xl font-bold text-[#ad4e28]">
                  {formatCurrency(expenseProof.amount)}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Ngày tạo</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDateTime(expenseProof.created_at)}
                    </div>
                  </div>
                </div>

                {expenseProof.changedStatusAt && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">
                        Ngày thay đổi trạng thái
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateTime(expenseProof.changedStatusAt)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Media Gallery */}
              {expenseProof.media && expenseProof.media.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Hình ảnh chứng từ ({expenseProof.media.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {expenseProof.media.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#ad4e28] transition-colors cursor-pointer"
                        onClick={() => setSelectedImage(url)}
                      >
                        <Image
                          src={url}
                          alt={`Chứng từ ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Note */}
              {expenseProof.adminNote && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    Ghi chú từ quản trị viên
                  </div>
                  <div className="text-sm text-blue-800">
                    {expenseProof.adminNote}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy chứng từ
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Xem ảnh chứng từ</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-[70vh]">
              <Image
                src={selectedImage}
                alt="Preview"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
