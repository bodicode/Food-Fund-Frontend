"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { operationRequestService } from "@/services/operation-request.service";
import { OperationRequest } from "@/types/api/operation-request";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Calendar, User, Package } from "lucide-react";

interface UpdateOperationRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: OperationRequest;
  onSuccess: () => void;
}

const expenseTypeLabels: Record<OperationRequest["expenseType"], string> = {
  COOKING: "Nấu ăn",
  DELIVERY: "Vận chuyển",
};

export function UpdateOperationRequestDialog({
  isOpen,
  onClose,
  request,
  onSuccess,
}: UpdateOperationRequestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">(
    request.status === "PENDING" ? "APPROVED" : (request.status as "APPROVED" | "REJECTED")
  );
  const [adminNote, setAdminNote] = useState(request.adminNote || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await operationRequestService.updateOperationRequestStatus({
        requestId: request.id,
        status,
        adminNote: adminNote.trim() || undefined,
      });

      toast.success("Cập nhật trạng thái thành công!");
      onSuccess();
    } catch (error) {
      toast.error("Cập nhật thất bại", {
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xử lý yêu cầu giải ngân</DialogTitle>
          <DialogDescription>
            Duyệt hoặc từ chối yêu cầu giải ngân từ người gây quỹ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Info */}
          <div className="space-y-4">
            <div>
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

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Tổng chi phí</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(parseFloat(request.totalCost))}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Người tạo</p>
                  <p className="font-medium text-gray-900">
                    {request?.user?.full_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Chiến dịch</p>
                  <p className="font-medium text-gray-900">
                    {request.campaignPhase.campaign?.title || "N/A"}
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
            </div>
          </div>

          <Separator />

          {/* Update Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as "APPROVED" | "REJECTED")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">Duyệt</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminNote">Ghi chú của Admin</Label>
              <Textarea
                id="adminNote"
                placeholder="Nhập ghi chú (tùy chọn)..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Ghi chú này sẽ được hiển thị cho người gây quỹ
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="btn-color">
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
