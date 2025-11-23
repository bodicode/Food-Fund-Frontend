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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { operationRequestService } from "@/services/operation-request.service";
import { translateError } from "@/lib/translator";
import { Loader } from "@/components/animate-ui/icons/loader";

interface CreateOperationRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignPhases: Array<{ id: string; phaseName: string }>;
  onSuccess: () => void;
}

export function CreateOperationRequestDialog({
  isOpen,
  onClose,
  campaignPhases,
  onSuccess,
}: CreateOperationRequestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaignPhaseId: "",
    expenseType: "" as "COOKING" | "DELIVERY" | "INGREDIENT" | "",
    title: "",
    totalCost: "",
  });
  const [displayCost, setDisplayCost] = useState("");

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (rawValue === "" || /^\d+$/.test(rawValue)) {
      setFormData({ ...formData, totalCost: rawValue });
      setDisplayCost(formatNumber(rawValue));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.campaignPhaseId ||
      !formData.expenseType ||
      !formData.title ||
      !formData.totalCost
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const totalCost = parseFloat(formData.totalCost);
    if (isNaN(totalCost) || totalCost <= 0) {
      toast.error("Số tiền không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      await operationRequestService.createOperationRequest({
        campaignPhaseId: formData.campaignPhaseId,
        expenseType: formData.expenseType as
          | "COOKING"
          | "DELIVERY"
          | "INGREDIENT",
        title: formData.title,
        totalCost: formData.totalCost,
      });

      toast.success("Tạo yêu cầu giải ngân thành công!");
      setFormData({
        campaignPhaseId: "",
        expenseType: "",
        title: "",
        totalCost: "",
      });
      setDisplayCost("");
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = translateError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu giải ngân</DialogTitle>
          <DialogDescription>
            Tạo yêu cầu giải ngân cho giai đoạn chiến dịch
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phase">Giai đoạn chiến dịch</Label>
            <Select
              value={formData.campaignPhaseId}
              onValueChange={(value) =>
                setFormData({ ...formData, campaignPhaseId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giai đoạn" />
              </SelectTrigger>
              <SelectContent>
                {campaignPhases.map((phase) => (
                  <SelectItem key={phase.id} value={phase.id}>
                    {phase.phaseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenseType">Loại chi phí</Label>
            <Select
              value={formData.expenseType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  expenseType: value as "COOKING" | "DELIVERY",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại chi phí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COOKING">Nấu ăn</SelectItem>
                <SelectItem value="DELIVERY">Vận chuyển</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              placeholder="VD: Chi phí nhân công - Phase 1"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCost">Tổng chi phí (VNĐ)</Label>
            <Input
              id="totalCost"
              type="text"
              placeholder="5,000,000"
              value={displayCost}
              onChange={handleCostChange}
            />
            {formData.totalCost && (
              <p className="text-xs text-gray-500">
                {parseFloat(formData.totalCost).toLocaleString("vi-VN")} đồng
              </p>
            )}
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
                  Đang tạo...
                </>
              ) : (
                "Tạo yêu cầu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
