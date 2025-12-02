"use client";

import React, { useState, useEffect } from "react";
import { expenseProofService } from "@/services/expense-proof.service";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, FileText, CheckCircle, XCircle, Clock, Eye, PlayCircle, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ExpenseProof, ExpenseProofStatus } from "@/types/api/expense-proof";
import { ExpenseProofDetailDialog } from "@/components/campaign/expense-proof-detail-dialog";

interface ExpenseProofListProps {
  campaignId: string;
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

const ITEMS_PER_PAGE = 30;

export function ExpenseProofList({ campaignId }: ExpenseProofListProps) {
  const [expenseProofs, setExpenseProofs] = useState<ExpenseProof[]>([]);
  const [allExpenseProofs, setAllExpenseProofs] = useState<ExpenseProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ExpenseProofStatus | "ALL">(
    "ALL"
  );
  const [selectedProofId, setSelectedProofId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const fetchAllExpenseProofs = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseProofService.getExpenseProofs({
        filter: {
          campaignId,
          status: statusFilter === "ALL" ? null : statusFilter,
        },
        limit: 1000,
        offset: 0,
      });
      setAllExpenseProofs(data);
    } catch (error) {
      console.error("Error fetching expense proofs:", error);
    } finally {
      setLoading(false);
    }
  }, [campaignId, statusFilter]);

  const paginateExpenseProofs = React.useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setExpenseProofs(allExpenseProofs.slice(startIndex, endIndex));
  }, [allExpenseProofs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchAllExpenseProofs();
  }, [fetchAllExpenseProofs]);

  useEffect(() => {
    paginateExpenseProofs();
  }, [paginateExpenseProofs]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  const getMediaUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `https://foodfund.sgp1.cdn.digitaloceanspaces.com/${url}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">Trạng thái:</span>
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as typeof statusFilter)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
            <SelectItem value="APPROVED">Đã duyệt</SelectItem>
            <SelectItem value="REJECTED">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expense Proof List */}
      {expenseProofs.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có chứng từ chi phí nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenseProofs.map((proof) => {
            const status = statusConfig[proof.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={proof.id}
                className="bg-white border rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        Mã yêu cầu: {proof.requestId}
                      </span>
                      <Badge className={`${status.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      {formatDateTime(proof.created_at)}
                    </div>
                    <div className="text-lg font-bold text-[#ad4e28]">
                      {formatCurrency(proof.amount)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProofId(proof.id)}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Eye className="w-4 h-4" />
                    Chi tiết
                  </Button>
                </div>

                {/* Media Gallery */}
                {proof.media && proof.media.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh/Video chứng từ:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {proof.media.map((item, index) => {
                        const url = getMediaUrl(item);
                        return (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#ad4e28] transition-colors cursor-pointer group bg-gray-50"
                            onClick={() => setSelectedMedia(url)}
                          >
                            {isImage(url) ? (
                              <Image
                                src={url}
                                alt={`Chứng từ ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
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
                {proof.adminNote && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Ghi chú từ quản trị viên:
                    </div>
                    <div className="text-sm text-gray-600">{proof.adminNote}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {allExpenseProofs.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={allExpenseProofs.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {/* Summary */}
      {expenseProofs.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Tổng số chứng từ</div>
              <div className="text-lg font-bold text-gray-900">
                {allExpenseProofs.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Đã duyệt</div>
              <div className="text-lg font-bold text-green-600">
                {allExpenseProofs.filter((p) => p.status === "APPROVED").length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Chờ duyệt</div>
              <div className="text-lg font-bold text-yellow-600">
                {allExpenseProofs.filter((p) => p.status === "PENDING").length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Tổng chi phí đã duyệt</div>
              <div className="text-lg font-bold text-[#ad4e28]">
                {(() => {
                  const total = allExpenseProofs
                    .filter((p) => p.status === "APPROVED")
                    .reduce((sum, p) => sum + Number(p.amount), 0);
                  return formatCurrency(total);
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedProofId && (
        <ExpenseProofDetailDialog
          isOpen={!!selectedProofId}
          onClose={() => setSelectedProofId(null)}
          expenseProofId={selectedProofId}
        />
      )}

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
    </div>
  );
}
