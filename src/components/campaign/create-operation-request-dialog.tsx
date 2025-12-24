import { useState, useEffect } from "react";
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
import { CampaignPhase } from "@/types/api/phase";
import { parseLocalDateTime } from "@/lib/utils/date-utils";

interface CreateOperationRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignPhases: CampaignPhase[];
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
    expenseType: "" as "COOKING" | "DELIVERY" | "",
    title: "",
    totalCost: "",
  });
  const [displayCost, setDisplayCost] = useState("");
  const [isAmountFixed, setIsAmountFixed] = useState(false);

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Auto-fill amount when phase and type are selected
  useEffect(() => {
    if (formData.campaignPhaseId && formData.expenseType) {
      const phase = campaignPhases.find(p => p.id === formData.campaignPhaseId);
      if (phase) {
        let amount = null;
        if (formData.expenseType === "COOKING") {
          amount = phase.cookingFundsAmount;
        } else if (formData.expenseType === "DELIVERY") {
          amount = phase.deliveryFundsAmount;
        }

        if (amount) {
          const amountStr = String(amount);
          setFormData(prev => ({ ...prev, totalCost: amountStr }));
          setDisplayCost(formatNumber(amountStr));
          setIsAmountFixed(true);
        } else {
          // If no amount is set (e.g. 0% budget), maybe we should clear it or leave it editable?
          // If budget is 0, then amount should probably be 0?
          // But let's assume if null/undefined, it's editable.
          setIsAmountFixed(false);
        }
      }
    } else {
      setIsAmountFixed(false);
    }
  }, [formData.campaignPhaseId, formData.expenseType, campaignPhases]);

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAmountFixed) return; // Prevent change if fixed

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
        expenseType: formData.expenseType as "COOKING" | "DELIVERY",
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

        {(() => {
          const now = new Date();
          const selectedPhase = campaignPhases.find(p => p.id === formData.campaignPhaseId);
          const isCookingReady = selectedPhase && (() => {
            const d = parseLocalDateTime(selectedPhase.cookingDate);
            return d && d <= now;
          })();
          const isDeliveryReady = selectedPhase && (() => {
            const d = parseLocalDateTime(selectedPhase.deliveryDate);
            return d && d <= now;
          })();

          return (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phase">Giai đoạn chiến dịch</Label>
                <Select
                  value={formData.campaignPhaseId}
                  onValueChange={(value) => {
                    const phase = campaignPhases.find(p => p.id === value);
                    let nextType: "COOKING" | "DELIVERY" | "" = "";
                    if (phase) {
                      const dC = parseLocalDateTime(phase.cookingDate);
                      const dD = parseLocalDateTime(phase.deliveryDate);
                      if (dC && dC <= now) nextType = "COOKING";
                      else if (dD && dD <= now) nextType = "DELIVERY";
                    }
                    setFormData({ ...formData, campaignPhaseId: value, expenseType: nextType });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giai đoạn" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignPhases.map((phase) => {
                      const dCooking = parseLocalDateTime(phase.cookingDate);
                      const dDelivery = parseLocalDateTime(phase.deliveryDate);
                      const isReady = (dCooking && dCooking <= now) || (dDelivery && dDelivery <= now);

                      return (
                        <SelectItem
                          key={phase.id}
                          value={phase.id}
                          disabled={!isReady}
                        >
                          {phase.phaseName} {!isReady && "(Chưa đến ngày giải ngân)"}
                        </SelectItem>
                      );
                    })}
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
                  disabled={!formData.campaignPhaseId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại chi phí" />
                  </SelectTrigger>
                  <SelectContent>
                    {isCookingReady && <SelectItem value="COOKING">Nấu ăn</SelectItem>}
                    {isDeliveryReady && <SelectItem value="DELIVERY">Vận chuyển</SelectItem>}
                    {!isCookingReady && !isDeliveryReady && formData.campaignPhaseId && (
                      <SelectItem value="NONE" disabled>Không có loại chi phí khả dụng</SelectItem>
                    )}
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
                  disabled={isAmountFixed}
                  className={isAmountFixed ? "bg-gray-100" : ""}
                />
                {formData.totalCost && (
                  <p className="text-xs text-gray-500">
                    {parseFloat(formData.totalCost).toLocaleString("vi-VN")} đồng
                    {isAmountFixed && " (Đã cố định theo ngân sách)"}
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
                <Button type="submit" disabled={loading || !formData.campaignPhaseId || !formData.expenseType} className="btn-color">
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
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}
