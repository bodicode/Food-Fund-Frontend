"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { expenseProofService } from "@/services/expense-proof.service";
import { ExpenseProof, ExpenseProofStatus } from "@/types/api/expense-proof";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { createCampaignSlug } from "@/lib/utils/slug-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, FileText, Calendar, ExternalLink, PlayCircle, X, MessageSquare } from "lucide-react";

// Helper functions (place outside component or keep inside if preferred, placing inside to match source)
const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

const getMediaUrl = (url: string) => {
  if (url.startsWith("http")) return url;
  return `https://foodfund.sgp1.cdn.digitaloceanspaces.com/${url}`;
};

import Image from "next/image";
import { toast } from "sonner";

interface AdminExpenseProofDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expenseProofId: string;
  onUpdated?: () => void;
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

export function AdminExpenseProofDetailDialog({
  isOpen,
  onClose,
  expenseProofId,
  onUpdated,
}: AdminExpenseProofDetailDialogProps) {
  const router = useRouter();
  const [expenseProof, setExpenseProof] = useState<ExpenseProof | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchExpenseProof = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseProofService.getExpenseProof(expenseProofId);
      setExpenseProof(data);
      setAdminNote(data?.adminNote || "");
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

  const handleAction = (type: "APPROVED" | "REJECTED") => {
    setActionType(type);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!actionType || !expenseProof) return;

    setIsUpdating(true);
    try {
      const result = await expenseProofService.updateExpenseProofStatus(
        expenseProof.id,
        {
          status: actionType,
          adminNote: adminNote.trim() || undefined,
        }
      );

      if (!result) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      toast.success(
        actionType === "APPROVED"
          ? "Đã duyệt chứng từ thành công!"
          : "Đã từ chối chứng từ!"
      );

      setShowConfirmDialog(false);
      onUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
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
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Mã yêu cầu</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
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

              {/* Campaign & Phase Info */}
              {expenseProof.request && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                        Chiến dịch
                      </div>

                      <button
                        onClick={() => {
                          if (expenseProof?.request?.campaignPhase.campaign.title && expenseProof?.request?.campaignPhase.campaign.id) {
                            const slug = createCampaignSlug(
                              expenseProof.request.campaignPhase.campaign.title,
                              expenseProof.request.campaignPhase.campaign.id
                            );
                            router.push(`/admin/campaigns/${slug}`);
                            onClose();
                          }
                        }}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-2 group"
                      >
                        {expenseProof?.request?.campaignPhase?.campaign?.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                          Giai đoạn
                        </div>
                        <div className="text-gray-900 dark:text-white">
                          {expenseProof?.request?.campaignPhase?.phaseName}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                          Địa điểm
                        </div>
                        <div className="text-gray-900 dark:text-white">
                          {expenseProof?.request?.campaignPhase?.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Items List */}
              {expenseProof.request?.items && expenseProof.request.items.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Số tiền</div>
                <div className="text-2xl font-bold text-[#ad4e28] dark:text-orange-500">
                  {formatCurrency(expenseProof.amount)}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Ngày tạo</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDateTime(new Date(expenseProof.created_at))}
                    </div>
                  </div>
                </div>

                {expenseProof.changedStatusAt && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Ngày thay đổi trạng thái
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDateTime(new Date(expenseProof.changedStatusAt))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Media Gallery */}
              {expenseProof.media && expenseProof.media.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Hình ảnh/Video chứng từ ({expenseProof.media.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {expenseProof.media.map((item, index) => {
                      const url = getMediaUrl(item);
                      return (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#ad4e28] transition-colors cursor-pointer group bg-gray-50"
                          onClick={() => setSelectedImage(url)}
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

              {/* Admin Note Input */}
              {/* Admin Note Section */}
              <div className="space-y-2">
                {expenseProof.status === "PENDING" ? (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Ghi chú của quản trị viên (Nhập lý do duyệt hoặc từ chối)
                    </label>
                    <Textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Nhập ghi chú..."
                      rows={4}
                      className="w-full resize-none focus:ring-2 focus:ring-[#ad4e28] focus:border-transparent"
                    />
                  </div>
                ) : expenseProof.adminNote ? (
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
                ) : null}
              </div>

              {/* Action Buttons */}
              {expenseProof.status === "PENDING" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleAction("APPROVED")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Duyệt chứng từ
                  </Button>
                  <Button
                    onClick={() => handleAction("REJECTED")}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Không tìm thấy chứng từ
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Media Preview Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="!max-w-[98vw] !w-[98vw] !h-[98vh] p-0 overflow-hidden bg-black/95 border-none flex flex-col">
            <DialogTitle className="sr-only">Xem chi tiết media</DialogTitle>
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              {isImage(selectedImage) ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedImage}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              ) : isVideo(selectedImage) ? (
                <video
                  src={selectedImage}
                  controls
                  className="max-w-full max-h-full w-full h-full object-contain"
                  autoPlay
                />
              ) : (
                <div className="text-white">Không thể xem trước file này</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Action Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "APPROVED" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>
                  Bạn có chắc chắn muốn{" "}
                  {actionType === "APPROVED" ? "duyệt" : "từ chối"} chứng từ này?
                </p>
                {adminNote && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <strong>Ghi chú:</strong> {adminNote}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isUpdating}
              className={
                actionType === "APPROVED"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isUpdating ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent >
      </AlertDialog >
    </>
  );
}
