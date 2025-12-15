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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, FileText, Calendar, PlayCircle, X, MessageSquare } from "lucide-react";
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
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

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

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  const getMediaUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `https://foodfund.sgp1.cdn.digitaloceanspaces.com/${url}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
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
                      {expenseProof.request?.id || expenseProof.requestId}
                    </div>
                  </div>
                </div>
                <Badge
                  className={`${statusConfig[expenseProof.status].color
                    } flex items-center gap-1`}
                >
                  {(() => {
                    const StatusIcon = statusConfig[expenseProof.status].icon;
                    return <StatusIcon className="w-4 h-4" />;
                  })()}
                  {statusConfig[expenseProof.status].label}
                </Badge>
              </div>

              {/* Items List */}
              {expenseProof.request?.items && expenseProof.request.items.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">
                    Chi tiết các mục chi tiêu
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên nguyên liệu</TableHead>
                          <TableHead>Nhà cung cấp</TableHead>
                          <TableHead className="text-right">Số lượng</TableHead>
                          <TableHead className="text-right">Đơn giá</TableHead>
                          <TableHead className="text-right">Tổng tiền</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenseProof.request.items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{item.ingredientName}</TableCell>
                            <TableCell>{item.supplier}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.estimatedUnitPrice)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.estimatedTotalPrice)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

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
                      {formatDateTime(new Date(expenseProof.created_at))}
                    </div>
                  </div>
                </div>

                {expenseProof.changedStatusAt && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">
                        Thời gian duyệt hóa đơn
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateTime(new Date(expenseProof.changedStatusAt))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Media Gallery */}
              {expenseProof.media && expenseProof.media.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Hình ảnh/Video chứng từ ({expenseProof.media.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {expenseProof.media.map((item, index) => {
                      const url = getMediaUrl(item);
                      return (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#ad4e28] transition-colors cursor-pointer group bg-gray-50"
                          onClick={() => setSelectedMedia(url)}
                        >
                          {isImage(url) ? (
                            <Image
                              src={url}
                              alt={`Chứng từ ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                          ) : isVideo(url) ? (
                            <div className="w-full h-full flex items-center justify-center relative">
                              <video src={url} className="w-full h-full object-cover pointer-events-none" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <PlayCircle className="w-10 h-10 text-white opacity-90 group-hover:scale-110 transition-transform" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FileText className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Admin Note */}
              {expenseProof.adminNote && (
                <div className="bg-blue-50/80 rounded-xl p-5 border border-blue-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <MessageSquare className="w-24 h-24 text-blue-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-semibold text-blue-900">
                        Ghi chú từ quản trị viên
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-100/50 text-blue-900 text-sm leading-relaxed">
                      {expenseProof.adminNote}
                    </div>
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

      {/* Media Preview Dialog */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none !h-[80vh] flex flex-col">
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              {isImage(selectedMedia) ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedMedia}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              ) : isVideo(selectedMedia) ? (
                <video
                  src={selectedMedia}
                  controls
                  className="max-w-full max-h-full"
                  autoPlay
                />
              ) : (
                <div className="text-white">Không thể xem trước file này</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
